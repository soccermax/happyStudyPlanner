import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {

  constructor(public db: AngularFirestore) { }

  getAllUniversitys(): Observable<any>{
    return this.db.collection('university').snapshotChanges()
        .pipe(map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            return data;
          });
        }));
  }

  getUniversityById(id: string): Observable<any>{
      return this.db.collection('university').doc(id)
          .snapshotChanges()
          .pipe(map( actions => {
              return actions.payload.data();
          }));
  }
}
