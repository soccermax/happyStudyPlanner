import { TestBed } from '@angular/core/testing';

import { UserLearningAgreementService } from './user-learning-agreement.service';

describe('UserLearningAgreementService', () => {
  let service: UserLearningAgreementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserLearningAgreementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
