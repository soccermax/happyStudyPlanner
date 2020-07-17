import { TestBed } from '@angular/core/testing';

import { LearningAgreementService } from './learning-agreement.service';

describe('LearningAgreementService', () => {
  let service: LearningAgreementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearningAgreementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
