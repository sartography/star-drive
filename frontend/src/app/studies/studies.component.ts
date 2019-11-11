import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api/api.service';
import {Hit, Query} from '../_models/query';
import {HitType} from '../_models/hit_type';
import {StudyStatus} from '../_models/study';
import {AuthenticationService} from '../_services/api/authentication-service';
import {User} from '../_models/user';

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
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.studyStatuses = Object.keys(StudyStatus).map(k => {
      return {name: k, label: StudyStatus[k]};
    });

    this.selectedStatus = this.studyStatuses[0];
    this.loadStudies();
  }

  ngOnInit() {
  }

  loadStudies() {
    const query = new Query({
      status: this.selectedStatus.name
    });
    this.api.searchStudies(query).subscribe(q => {
      this.query = new Query(q);
      this.studyHits = this.query.hits.filter(h => h.status === this.selectedStatus.label);
    });
  }

  selectStatus(status: StudyStatusObj) {
    this.selectedStatus = status;
    this.loadStudies();
  }

}
