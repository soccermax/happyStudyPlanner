import { Component, OnInit } from '@angular/core';
import {Course} from '../../core/Course';
import {CourseService} from '../../shared/course.service';
import {LearningAgreement} from '../../core/LearningAgreement';
import {User} from '../../core/User';
import {UserService} from '../../shared/user.service';
import {UniversityService} from '../../shared/university.service';
import {University} from '../../core/University';
import {LearningAgreementService} from '../../shared/learning-agreement.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edit-agreement-view',
  templateUrl: './edit-agreement-view.component.html',
  styleUrls: ['./edit-agreement-view.component.css']
})
export class EditAgreementViewComponent implements OnInit {


  activeView = 'Information';
  currentUser: any;
  firebaseUser: any;
  currentResponsible: any;
  homeUniversity = new University('bG6UlgkEQFJQzsXptaZZ', 'Deutschland', 'Deutsch', 'Karlsruhe University of Applied Sciences');
  partnerUniversity = new University('3UaB7ihAqwfg2DEdMBSc', 'Australien', 'Englisch', 'University of Brisbane');

  courses: any[];
  homeCourses: any[];
  users: any[];
  learningAgreement = new LearningAgreement(false, null, null, null, null,
      null, null, []);
  choosenCourses: any[] = [];
  choosenHomeCoures: any[] = [];

  constructor(public courseService: CourseService,
              public userService: UserService,
              public universityService: UniversityService,
              public lAService: LearningAgreementService,
              public auth: AngularFireAuth,
              public router: Router) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.firebaseUser = user;
        this.getCurrentUser();
      } else {
        this.router.navigateByUrl('login');
      }
    });
    this.getAllCourses();
    this.getAllUsers();
  }

  ngOnInit(): void {
  }

  getAllCourses(): void {
    this.courseService.getAllCourses()
        .subscribe(res => {
          this.courses = res;
          this.homeCourses = this.courses.filter(c => c.data.university = this.homeUniversity.id);
        });
  }

  getAllUsers(): void {
    this.userService.getAllUsers()
        .subscribe(res => {
          this.users = res;
          this.setUserRoles();
        });
  }

  addCourseToLearningAgreement(c: Course, hc: Course): void {
    const coursePair = {courseHomeUniversity: hc.id, courseTargetUniversity: c.id};
    if (!this.choosenCourses.includes(c) && !this.choosenHomeCoures.includes(hc)){
      this.learningAgreement.courses.push(coursePair);
      this.choosenCourses.push(c);
      this.choosenHomeCoures.push(hc);
    } else {
      alert('Der Kurs ist bereits im Learning Agreement enthalten!');
    }
  }

  setUserRoles(): void {
    const profs = this.users.filter(u => u.data.role === 'Professor');
    this.currentResponsible = profs[0] as User;
  }

  createLearningAgreement(): void {
    this.learningAgreement.targetUniversity = this.partnerUniversity.id;
    this.learningAgreement.student = this.currentUser.id;
    this.learningAgreement.responsible = this.currentResponsible.id;
    this.learningAgreement.score = 92;
    this.lAService.createLearningAgreement(this.learningAgreement);
  }

  getCurrentUser(): void {
    this.userService.getAllUsers()
        .subscribe(res => {
          res.map(r => {
            if (r.data.email === this.firebaseUser.email){
              this.currentUser = r;
              console.log(this.currentUser);
            }
          });
        });
  }

}
