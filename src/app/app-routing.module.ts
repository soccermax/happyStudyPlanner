import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NavbarViewComponent} from './navbar-view/navbar-view.component';

const routes: Routes = [
  { path: '', component: NavbarViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
