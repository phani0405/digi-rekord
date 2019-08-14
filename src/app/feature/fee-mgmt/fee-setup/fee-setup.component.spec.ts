import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeSetupComponent } from './fee-setup.component';

describe('FeeSetupComponent', () => {
  let component: FeeSetupComponent;
  let fixture: ComponentFixture<FeeSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeSetupComponent ]
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
