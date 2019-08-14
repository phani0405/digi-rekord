import { TestBed, inject } from '@angular/core/testing';

import { TimelineMgmtService } from './timeline-mgmt.service';

describe('TimelineMgmtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimelineMgmtService]
    });
  });

  it('should be created', inject([TimelineMgmtService], (service: TimelineMgmtService) => {
    expect(service).toBeTruthy();
  }));
});
