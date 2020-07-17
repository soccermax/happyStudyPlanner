import { Injectable } from '@angular/core';
import {LearningAgreement} from './entity/LearningAgreement';

@Injectable({
  providedIn: 'root'
})
export class UserLearningAgreementService {

  learningAgreement: LearningAgreement = new LearningAgreement(false, null, null, null,
      null, null, null, []);

  constructor() { }
}
