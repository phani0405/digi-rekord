import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { LoginUserService, AlertService, MarksMgmtService, SchoolMgmtService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';

import { filter } from 'rxjs/operator/filter';

@Component({
  selector: 'app-marks-remarks',
  templateUrl: './remarks.component.html',
  styleUrls: ['./remarks.component.scss']
})
export class MarksRemarkComponent implements OnInit {
  model: any = {
    selectedClass: null
  };
  loading = false;
  message: string;
  classes: any = [];
  students: any
  terms: any = [];
  selectedClass: any;
  selectedTerm: any;

  constructor(
    private alert: AlertService,
    private auth: LoginUserService,
    private marksService: MarksMgmtService,
    private schoolService: SchoolMgmtService,
    public toastr: ToastsManager, vcr: ViewContainerRef,
  ) {
    this.toastr.setRootViewContainerRef(vcr)
    this.getDropDownValues();
  }

  ngOnInit() {
    
  }

  getDropDownValues() {
    if (this.auth.userRole().toLowerCase() === 'schooladmin') {
      this.getDDValuesForPrincipalAndSchoolAdmin();
    }
    if (this.auth.userRole().toLowerCase() === 'teachingstaff') {
      this.getDropDownValuesForTeachingStaff();
    }
  }

  getDDValuesForPrincipalAndSchoolAdmin() {
    this.classes = this.auth.classDetail
      this.terms = this.auth.termDetail
      if(!this.classes || !this.terms) {
        const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
        this.getSchoolClassDetails(schoolId);
      }
  }

  getDropDownValuesForTeachingStaff() {
    const detail = this.auth.registeredDetails();
    const role = detail && detail[0] &&
      detail[0].staffRole ? detail[0].staffRole.toLocaleLowerCase() : '';
    switch (role) {
        case 'principal':
            this.getDDValuesForPrincipalAndSchoolAdmin();
            break;
        case 'staff':

            break;
    }
}

  getSchoolClassDetails(schoolId) {
    this.schoolService.getSchoolDetail(schoolId)
      .subscribe(
      schoolDetail => {
        if (schoolDetail) {
          this.auth.classDetail = schoolDetail.classDetails;
          this.auth.subjectDetail = schoolDetail.subjectDetails;
          this.auth.termDetail = schoolDetail.termDetails;
          this.classes = this.auth.classDetail;
          this.terms = this.auth.termDetail;
        } else {
        }
      },
      error => {
      },
    );
  }

  onChangeClass(event) {
    this.model.selectedClass = event
    console.log("selected class", event)
  }

  onChangeTerm(event) {
    this.model.selectedTerm = event
    console.log("selected term", event)
  }

  getSelectedDDValues() {
    return {
      classID: this.model.selectedClass.classID,
      termInstituteID: this.model.selectedTerm.termInstituteID,
      schoolID: this.auth.getSchoolID()
    }
  }

  getStudents() {
    this.marksService.getStudentsForRemarks(this.getSelectedDDValues())
    .subscribe(
      schoolDetail => {
        if (schoolDetail && schoolDetail.length > 0) {
          this.students = schoolDetail[0];
        } else {
          this.students = schoolDetail
        }
      },
      error => {
      },
    )
  }

  submitRemarks(students) {
    console.log("Update students", students)
    const req = Object.assign({}, students)
    req.termInstituteID = this.model.selectedTerm.termInstituteID
    req.updatedBy = this.auth.userId()
    this.marksService.submitStudentRemarks(req)
    .subscribe(
      resp => {
        if (resp && !resp.error) {
          this.toastr.success("Remarks submitted successfully")
          this.getStudents()
        } else {
          this.toastr.error(resp.error)
        }
      },
      error => {
        this.toastr.error("Unable to submit, Please try again later")
      },
    )
  }
}
