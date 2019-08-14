import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeCollectComponent } from './fee-collect.component';

describe('FeeCollectComponent', () => {
  let component: FeeCollectComponent;
  let fixture: ComponentFixture<FeeCollectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeCollectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
