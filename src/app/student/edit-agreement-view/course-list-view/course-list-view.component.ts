import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import 'firebase/firestore';
import {Course} from '../../../entity/Course';
import {UserLearningAgreementService} from '../../../user-learning-agreement.service';

@Component({
  selector: 'app-course-list-view',
  templateUrl: './course-list-view.component.html',
  styleUrls: ['./course-list-view.component.css']
})
export class CourseListViewComponent implements OnInit {

  courses: Course[] = [];

  constructor(private db: AngularFirestore,
              private uS: UserLearningAgreementService) {
    this.db.collection('course').get().forEach(courses => {
      courses.forEach(c => {
        const d = c.data();
        this.courses.push(new Course(d.id, d.name, d.major, d.description, d.creditPoints, d.language, d.university, d.tags));
      });
    });
  }

  ngOnInit(): void {
  }

    addCourse(id: string) {
      // tslint:disable-next-line:no-shadowed-variable
        const course = this.courses.filter(course => course.id === id)[0];
        this.uS.learningAgreement.courses.push(course);
        console.log(this.uS.learningAgreement);
    }
}
