import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAgreementViewComponent } from './edit-agreement-view.component';

describe('EditAgreementViewComponent', () => {
  let component: EditAgreementViewComponent;
  let fixture: ComponentFixture<EditAgreementViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAgreementViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAgreementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
