import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFormOptions } from '@ngx-formly/core';
import { keysToCamel } from 'src/util/snakeToCamel';
import { ApiService } from '../_services/api/api.service';
import { User } from '../_models/user';
import { Participant } from '../_models/participant';
import { Flow } from '../_models/flow';
import { Step, StepStatus } from '../_models/step';
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthenticationService} from '../_services/api/authentication-service';
import {GoogleAnalyticsService} from '../google-analytics.service';

enum FlowState {
  NO_CONSENT = 'no_consent',
  INTRO = 'intro',
  LOADING = 'loading',
  COMPLETE = 'complete',
  SHOW_FORM = 'form',
}

@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss']
})
export class FlowComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  user: User;
  participant: Participant;
  flow: Flow;

  activeStep = 0;
  flowState = FlowState;
  state = FlowState.LOADING;
  startTime: number;

  sidebarOpen = true;

  model: any = {};
  form: FormGroup;
  fields = [];
  options: FormlyFormOptions;

  static clone(o: any): any {
    return JSON.parse(JSON.stringify(o));
  }

  constructor(
    private api: ApiService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private googleAnalyticsService: GoogleAnalyticsService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) {
    // We will change the display slightly based on mobile vs desktop
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.authenticationService.refresh().subscribe(user => {
      this.user = user;
      this.route.params.subscribe(params => {
        this.participant = this.user.getParticipantById(parseInt(params.participantId, 10));
        console.log('Participant loaded:' + this.participant.id);
        this.loadFlow(params.flowName);
      });
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  loadFlow(flowName: string) {
    this.api
      .getFlow(flowName, this.participant.id)
      .subscribe(f => {
        this.flow = new Flow(f);
        console.log('Flow Loaded:' + this.flow.name);
        if (!this.participant.has_consented) {
          this.state = this.flowState.NO_CONSENT;
        } else if (this.participant.has_consented && this.flow.percentComplete() === 0) {
          this.state = this.flowState.INTRO;
        } else {
          this.goToNextAvailableStep();
        }
      });
  }

  updateParticipant(participantId: number) {
    this.api.getParticipant(participantId).subscribe(
      p => {
        this.participant = p;
      }
    );
  }

  goToNextAvailableStep() {
    // get the participant back first to catch any changes to the preferred name
    this.updateParticipant(this.participant.id);

    // Go to the next incomplete step.  Loop back around to the beginning of steps, in case an
    // earlier step is incomplete.  NOTE:  You will stay on the current step if it is not complete.

    console.log('The flow is ' + this.flow.percentComplete() + '% complete.');
    if (this.flow.percentComplete() < 100) {
      let index = this.activeStep;
      if (this.flow.steps[this.activeStep].status === StepStatus.COMPLETE) {
        console.log('Processing index :' + index);
        index++;
        while (index !== this.activeStep) {
          if (this.flow.steps[index] && this.flow.steps[index].status !== StepStatus.COMPLETE) {
            this.activeStep = index;
            break;
          }
          if (index >= this.flow.steps.length - 1) { index = 0; } else { index++; }
        }
      }
      console.log('The Active Step index is :' + this.activeStep);
      this.loadActiveStep();
    } else {
      console.log('This flow is already completed.');
      this.state = FlowState.COMPLETE;
      this.scrollToTop();
    }
  }

  markConsentAndGoToFlow(participant: Participant) {
    participant.has_consented = true;
    this.api.updateParticipant(participant).subscribe(participant => {
      this.loadFlow(this.flow.name);
    });
  }

  goToStep(step: Step) {
    // get the participant back first to catch any changes to the preferred name
    this.updateParticipant(this.participant.id);

    console.log('Requested to set the step to ' + step.name);
    for (let i = 0; i < this.flow.steps.length; i++) {
      if (this.flow.steps[i].name === step.name) {
        console.log('Setting Active Step to ' + i);
        this.activeStep = i;
        break;
      }
    }
    this.loadActiveStep();
    if (this.mobileQuery.matches) {
      this.sidebarOpen = false;
    }
  }

  currentStep(): Step {
    return this.flow.steps[this.activeStep];
  }

  loadActiveStep() {
    const step = this.flow.steps[this.activeStep];
    this.api.getQuestionnaireMeta(this.flow.name, step.name).subscribe(q => {
      // Load the form with previously-submitted data, if available
      if (step.questionnaire_id > 0) {
        this.api
          .getQuestionnaire(step.name, step.questionnaire_id)
          .subscribe(qData => {
            this.model = qData;
            this.renderForm(step, q);
          });
      } else {
        this.renderForm(step, q);
      }
    });
  }


  private renderForm(step: Step, q_meta) {
    this.startTime = performance.now();
    this.fields = this.infoToForm(q_meta);
    console.log('Model: ', this.model);
    console.log('Fields: ', this.fields);
    console.log('Step:', step);

    this.form = new FormGroup({});
    this.options = {
      formState: {
        mainModel: this.model,
        preferredName: this.participant.name
      }
    };
    this.state = this.flowState.SHOW_FORM;
  }

  private infoToForm(info) {
    const fields = [];
    for (const field of info.fields) {
      if (field.fieldArray) {
        field.fieldArray.model = this.model[field.name];
      }
      fields.push(keysToCamel(field));

    }
    fields.sort((f1, f2) => f1.displayOrder - f2.displayOrder);
    return fields;
  }

  submit() {
    // force the correct participant id.
    this.model['participant_id'] = this.participant.id;
    this.model['time_on_task_ms'] = performance.now() - this.startTime;

    // Post to the questionnaire endpoint, and then reload the flow.
    if (this.currentStep().questionnaire_id > 0) {
      this.api.updateQuestionnaire(this.currentStep().name, this.currentStep().questionnaire_id, this.model)
        .subscribe(() => {
          this.googleAnalyticsService.event('update',  {
            'event_category': 'flow progress',
            'event_label': this.currentStep().name,
            'value': this.flow.percentComplete()
          });
          this.loadFlow(this.flow.name);
          this.scrollToTop();
        });
    } else {
      this.api.submitQuestionnaire(this.flow.name, this.currentStep().name, this.model)
        .subscribe(() => {
          this.googleAnalyticsService.event('submit',  {
            'event_category': 'flow progress',
            'event_label': this.currentStep().name,
            'value': this.flow.percentComplete()
          });
          this.loadFlow(this.flow.name);
          this.scrollToTop();
        });
    }
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  numCompletedSteps() {
    return this.flow.steps.filter(s => s.status === StepStatus.COMPLETE).length;
  }

  numTotalSteps() {
    return this.flow.steps.length;
  }
}
