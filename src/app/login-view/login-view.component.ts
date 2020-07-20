import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css']
})
export class LoginViewComponent implements OnInit {

  mail: string;
  password: string;

  constructor(public auth: AngularFireAuth,
              public router: Router) {
    this.auth.authState.subscribe(user => {
      if (user) {
        console.log('User eingeloggt');
      } else {
        console.log('User nicht eingeloggt!');
      }
    });
  }

  ngOnInit(): void {
  }

  loginUser(): void {
    this.auth.signInWithEmailAndPassword(this.mail, this.password).then(() => {
      this.router.navigateByUrl('home');
    }, error => {
      console.log(error.message);
    });
  }
}


