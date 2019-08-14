import { TestBed, inject } from '@angular/core/testing';

import { LeaveMgmtService } from './leave-mgmt.service';

describe('LeaveMgmtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeaveMgmtService]
    });
  });

  it('should be created', inject([LeaveMgmtService], (service: LeaveMgmtService) => {
    expect(service).toBeTruthy();
  }));
});
