import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarViewComponent } from './navbar-view.component';

describe('NavbarViewComponent', () => {
  let component: NavbarViewComponent;
  let fixture: ComponentFixture<NavbarViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
