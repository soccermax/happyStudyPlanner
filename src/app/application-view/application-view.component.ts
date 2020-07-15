import { Component, OnInit } from '@angular/core';
import {UserLearningAgreementService} from '../user-learning-agreement.service';
import {StateService} from '../state.service';

@Component({
  selector: 'app-application-view',
  templateUrl: './application-view.component.html',
  styleUrls: ['./application-view.component.css']
})
export class ApplicationViewComponent implements OnInit {

  constructor(public uS: UserLearningAgreementService,
              public sS: StateService) { }

  ngOnInit(): void {
  }

  editLearningAgreement() {
    this.sS.state = 'editAgreement';
  }
}
