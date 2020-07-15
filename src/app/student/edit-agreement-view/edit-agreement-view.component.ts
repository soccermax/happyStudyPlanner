import { Component, OnInit } from '@angular/core';
import {Course} from '../../core/Course';
import {CourseService} from '../../shared/course.service';
import {LearningAgreement} from '../../core/LearningAgreement';
import {User} from '../../core/User';
import {UserService} from '../../shared/user.service';
import {UniversityService} from '../../shared/university.service';
import {University} from '../../core/University';
import {LearningAgreementService} from '../../shared/learning-agreement.service';

@Component({
  selector: 'app-edit-agreement-view',
  templateUrl: './edit-agreement-view.component.html',
  styleUrls: ['./edit-agreement-view.component.css']
})
export class EditAgreementViewComponent implements OnInit {

  activeView = 'Information';
  currentUser: User;
  currentResponsible: User;
  homeUniversity = new University('bG6UlgkEQFJQzsXptaZZ', 'Deutschland', 'Deutsch', 'Karlsruhe University of Applied Sciences');
  partnerUniversity = new University('3UaB7ihAqwfg2DEdMBSc', 'Australien', 'Englisch', 'University of Brisbane');

  courses: Course[];
  homeCourses: Course[];
  users: User[];
  learningAgreement = new LearningAgreement(false, null, null, null, null,
      null, null, []);
  choosenCourses: Course[] = [];

  constructor(public courseService: CourseService,
              public userService: UserService,
              public universityService: UniversityService,
              public lAService: LearningAgreementService) {
    this.getAllCourses();
    this.getAllUsers();
  }

  ngOnInit(): void {
  }

  getAllCourses(): void {
    this.courseService.getAllCourses()
        .subscribe(res => {
          this.courses = res;
          this.homeCourses = this.courses.filter(c => c.university = this.homeUniversity.id);
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
    if (!this.learningAgreement.courses.includes(coursePair)){
      this.learningAgreement.courses.push(coursePair);
      this.choosenCourses.push(c);
    } else {
      alert('Der Kurs ist bereits im Learning Agreement enthalten!');
    }
  }

  setUserRoles(): void {
    const students = this.users.filter(u => u.role === 'Student');
    const profs = this.users.filter(u => u.role === 'Professor');
    this.currentUser = students[0] as User;
    this.currentResponsible = profs[0] as User;
  }

  createLearningAgreement(): void {
    this.learningAgreement.targetUniversity = this.partnerUniversity.id;
    this.learningAgreement.student = this.currentUser.id;
    this.learningAgreement.responsible = this.currentResponsible.id;
    this.learningAgreement.score = 92;
    this.lAService.createLearningAgreement(this.learningAgreement);
  }

}
