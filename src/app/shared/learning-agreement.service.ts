import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {LearningAgreement} from '../core/LearningAgreement';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class LearningAgreementService {

  constructor(public db: AngularFirestore) { }

  createLearningAgreement(lA: LearningAgreement): void {
    this.db.collection('learningAgreement').add({
      approved: lA.approved,
      lastEvaluatedOn: null,
      lastModifiedOn: new Date(),
      student: lA.student,
      responsible: lA.responsible,
      score: lA.score,
      targetUniversity: lA.targetUniversity,
      courses: lA.courses
    }).then(() => {
      alert('Learning Agreement erfolgreich abgesendet!');
    });
  }
}
