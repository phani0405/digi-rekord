import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SMSAccountComponent } from './sms-account.component';

describe('SMSAccountComponent', () => {
  let component: SMSAccountComponent;
  let fixture: ComponentFixture<SMSAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SMSAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SMSAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
