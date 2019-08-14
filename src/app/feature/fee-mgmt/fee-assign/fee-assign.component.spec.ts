import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeAssignComponent } from './fee-assign.component';

describe('FeeAssignComponent', () => {
  let component: FeeAssignComponent;
  let fixture: ComponentFixture<FeeAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
