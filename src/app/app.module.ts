import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import { NavbarViewComponent } from './navbar-view/navbar-view.component';
import { ApplicationViewComponent } from './application-view/application-view.component';
import { EditAgreementViewComponent } from './student/edit-agreement-view/edit-agreement-view.component';
import { CourseListViewComponent } from './student/edit-agreement-view/course-list-view/course-list-view.component';
import { HomeViewComponent } from './home-view/home-view.component';
import { LoginViewComponent } from './login-view/login-view.component';
import {FormsModule} from '@angular/forms';
import { MailApprovedTemplateComponent } from './mail-approved-template/mail-approved-template.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarViewComponent,
    ApplicationViewComponent,
    EditAgreementViewComponent,
    CourseListViewComponent,
    HomeViewComponent,
    LoginViewComponent,
    MailApprovedTemplateComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
