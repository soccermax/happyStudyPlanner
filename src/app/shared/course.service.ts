import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(public db: AngularFirestore) { }

  getAllCourses(): Observable<any> {
    return this.db.collection('course')
        .snapshotChanges()
        .pipe(map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, data};
          });
        }));
  }
}
