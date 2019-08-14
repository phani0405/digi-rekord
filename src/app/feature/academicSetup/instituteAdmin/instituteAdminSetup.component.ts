import { InstituteService, LoginUserService } from '../../../helpers/services/service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-institute-admin-setup',
  templateUrl: './instituteAdminSetup.component.html',
})
export class InstituteAdminSetupComponent implements OnInit {

  instituteDetail: any;

  constructor(
    private instituteService: InstituteService,
    private auth: LoginUserService,
  ) { }

  ngOnInit() {
    this.instituteService.getInstituteByUserId()
      .subscribe(
      institute => {
        if (institute) {
          this.instituteDetail = institute[0];
          this.auth.subjectDetail = this.instituteDetail.subjectDetails;
          this.auth.classDetail = this.instituteDetail.classDetails;
          this.auth.termDetail = this.instituteDetail.termDetails;
        } else {
        }
      },
    );
  }
}

function newFunction(): string {
  return '<app-institute-admin-setup>';
}