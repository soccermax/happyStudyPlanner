import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public db: AngularFirestore) { }

  getAllUsers(): Observable<any> {
    return this.db.collection('user')
        .snapshotChanges()
        .pipe(map(action => {
          return action.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, data};
          });
        }));
  }
}
