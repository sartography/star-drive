import {Component, OnInit} from '@angular/core';
import {ApiService} from '../_services/api/api.service';
import {Hit, Query} from '../_models/query';
import {Study, StudyStatus} from '../_models/study';
import {AuthenticationService} from '../_services/api/authentication-service';
import {User} from '../_models/user';
import {ActivatedRoute, Router} from '@angular/router';
import {Meta} from '@angular/platform-browser';

interface StudyStatusObj {
  name: string;
  label: string;
}

@Component({
  selector: 'app-studies',
  templateUrl: './studies.component.html',
  styleUrls: ['./studies.component.scss']
})
export class StudiesComponent implements OnInit {
  query: Query;
  studyStatuses: StudyStatusObj[];
  selectedStatus: StudyStatusObj;
  studyHits: Hit[];
  currentUser: User;

  constructor(
    private api: ApiService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private meta: Meta,
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.meta.updateTag(
        { property: 'og:image', content: location.origin + '/assets/studies/hero.jpg' },
        `property='og:image'`);
    this.meta.updateTag(
      { property: 'og:image:secure_url', content: location.origin + '/assets/studies/hero.jpg' },
      `property='og:image:secure_url'`);
    this.meta.updateTag(
      { name: 'twitter:image', content: location.origin + '/assets/studies/hero.jpg' },
      `name='twitter:image'`);
    this.studyStatuses = Object.keys(StudyStatus).map(k => {
      return {name: k, label: StudyStatus[k]};
    });
    this.route.params.subscribe(params => {
      if ('studyStatus' in params) {
        this.selectedStatus = this.studyStatuses.find(x => x.name === params['studyStatus']);
      } else {
        this.selectedStatus = this.studyStatuses[0];
        this.route.params['studyStatus'] = this.studyStatuses[0].name;
        this.router.navigate(['/studies/' + this.studyStatuses[0].name]);
      }
    });
    this.loadStudies();
  }

  ngOnInit() {
  }

  loadStudies() {
    this.api.getStudiesByStatus(this.selectedStatus.name).subscribe(studies => {
      this.studyHits = this._studiesToHits(studies);
    });
  }

  selectStatus(status: StudyStatusObj) {
    this.selectedStatus = status;
    this.router.navigate(['/studies/' + status.name]);
    this.loadStudies();
  }

   private _studiesToHits(studies: Study[]): Hit[] {
      return studies
        .map(s => {
          return new Hit({
            id: s.id,
            type: 'study',
            ages: s.ages,
            title: s.short_title,
            content: s.description,
            description: s.short_description,
            last_updated: s.last_updated,
            highlights: null,
            url: `/study/${s.id}`,
            label: 'Research Studies',
            status: this.studyStatuses.find(stat => stat.name === s.status).label
          });
        });
  }

}
