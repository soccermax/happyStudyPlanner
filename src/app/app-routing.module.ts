import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NavbarViewComponent} from './navbar-view/navbar-view.component';
import {CourseListViewComponent} from './student/edit-agreement-view/course-list-view/course-list-view.component';
import {HomeViewComponent} from './home-view/home-view.component';
import {EditAgreementViewComponent} from './student/edit-agreement-view/edit-agreement-view.component';
import {LoginViewComponent} from './login-view/login-view.component';

const routes: Routes = [
  { path: 'home', component: HomeViewComponent},
  { path: 'cl', component: CourseListViewComponent},
  { path: 'eA', component: EditAgreementViewComponent},
  { path: '', component: LoginViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
