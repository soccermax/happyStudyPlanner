import { Component, OnInit } from '@angular/core';
import {UserLearningAgreementService} from '../user-learning-agreement.service';
import {StateService} from '../state.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-application-view',
  templateUrl: './application-view.component.html',
  styleUrls: ['./application-view.component.css']
})
export class ApplicationViewComponent implements OnInit {

  activeView = 'Aktuelles';

  constructor(public uS: UserLearningAgreementService,
              public sS: StateService,
              public auth: AngularFireAuth,
              public router: Router) {
    this.auth.authState.subscribe(user => {
      if (user) {
      } else {
        this.router.navigateByUrl('login');
      }
    });
  }

  ngOnInit(): void {
  }
}
