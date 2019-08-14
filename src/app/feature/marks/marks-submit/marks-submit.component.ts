import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoginUserService, AlertService, MarksMgmtService, SchoolMgmtService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';

import { filter } from 'rxjs/operator/filter';
import { Util } from '../../../helpers/util';

@Component({
  selector: 'app-marks-submit',
  templateUrl: './marks-submit.component.html',
  styleUrls: ['./marks-submit.component.scss']
})
export class MarksSubmitComponent implements OnInit {
  model: any = {
    selectedClass: null
  };
  loading = false;
  message: string;
  classes: any = [];
  students: any
  terms: any = [];
  subjects: any = [];
  selectedClass: any;
  selectedTerm: any;
  sdTypes: any = ['Grades', 'Marks']
  subjectDivisions: any;
  titleText: string;
  modalReference: any;
  classMode: any;
  selectedSubjectDivision: any;
  marksReportDetails: any;
  termSubjectDetails: any;
  totalMaxMarks: any;
  totalMinMarks: any;

  constructor(
    private alert: AlertService,
    private auth: LoginUserService,
    private marksService: MarksMgmtService,
    private schoolService: SchoolMgmtService,
    private modalService: NgbModal,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    public util: Util,
  ) {
    this.toastr.setRootViewContainerRef(vcr)
    this.getDropDownValues();
  }

  ngOnInit() {
  }

  getSelectedDDValues() {
    return {
      classID: this.model.selectedClass.classID,
      subjectID: this.model.selectedSubject.subjectID,
      termID: this.model.selectedTerm.termInstituteID,
      schoolID: this.auth.getSchoolID()
    }
  }

  getAllSubjectDivision() {
    this.message = '';
    const data = this.getSelectedDDValues();
    this.marksReportDetails = {}
    this.termSubjectDetails = {}
    this.marksService.getStudentsForMarksReportCard(data)
      .subscribe(
      schoolDetail => {
        if (schoolDetail && !schoolDetail.error) {
          console.log('schoolDetail', schoolDetail)
          this.marksReportDetails = schoolDetail.marksReportDetails;
          this.termSubjectDetails = schoolDetail.termSubjectDetails;
          this.storeTotalMarks(this.termSubjectDetails);
        } else {
          this.message = schoolDetail.error
        }
      },
      error => {
        this.toastr.error("Unable to get student, please try again later")
      },
    )
  }

  storeTotalMarks(termSubjectDetails) {
    this.totalMaxMarks = 0;
    this.totalMinMarks = 0;
    termSubjectDetails.subjects.subjectDivisions.forEach(element => {
      if (element.subjectDivisionType === 'Marks') {
        this.totalMaxMarks = this.totalMaxMarks + element.maxMarks;        
        this.totalMinMarks = this.totalMinMarks + element.minMarks;
      }
    });
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
    if (!this.classes || !this.terms) {
      const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
      this.getSchoolClassDetails(schoolId);
    }
  }

  getDropDownValuesForTeachingStaff() {
    const detail = this.auth.registeredDetails();
    const role = detail && detail[0] &&
      detail[0].staffRole ? detail[0].staffRole.toLocaleLowerCase() : '';
    switch (role) {
      case 'schooladmin':
        this.getDDValuesForPrincipalAndSchoolAdmin();
        break;
      case 'principal':
        this.getDDValuesForPrincipalAndSchoolAdmin();
        break;
      case 'staff':
        this.getSchoolClassDetails(detail[0] && detail[0].schoolID, true)
        break;
    }
  }

  updateClassDetailsForStaff() {
    const detail = this.auth.registeredDetails();
    this.auth.classDetail = detail && detail[0] && detail[0].classTeacherDetails;
    this.classes = this.auth.classDetail;
  }

  getSchoolClassDetails(schoolId, isClassUpdate?: boolean) {
    this.schoolService.getSchoolDetail(schoolId)
      .subscribe(
      schoolDetail => {
        if (schoolDetail) {
          this.auth._schoolDetail = schoolDetail;
          this.auth.classDetail = schoolDetail.classDetails;
          this.auth.termDetail = schoolDetail.termDetails;
          this.classes = this.auth.classDetail;
          this.terms = this.auth.termDetail;
          if (isClassUpdate) {
            this.updateClassDetailsForStaff();
          }
        } else {
        }
      },
      error => {
      },
    );
  }

  onChangeClass(event) {
    this.model.selectedSubject = {}
    this.model.selectedClass = {}
    this.model.selectedClass = event
    const detail = this.auth.schoolDetail;
    this.subjects = event.subjectDetails;
    if (!this.subjects) {
      const classDetail = detail.classDetails.find((el => {
        return el.classID === event.classID;
      }));
      this.subjects = classDetail.subjectDetails;
    }
    console.log('selected class', event, this.subjects)
  }

  onChangeTerm(event) {
    this.model.selectedTerm = {}
    this.model.selectedTerm = event
    console.log('selected term', event)
  }

  onChangeSubject(event) {
    this.model.selectedSubject = event
    console.log('selected subject', event)
  }

  onlyNumberKey(event) {
    const n = (event.charCode == 8 || event.charCode == 0 ? null : event.charCode >= 48 && event.charCode <= 57)
      return n
  }

  submitMarks(data) {

    data.updatedBy = this.auth.userId()
    this.marksService.submitStudentMarksReportCard(data)
      .subscribe(
      resp => {
        if (resp && !resp.error) {
          console.log('resp', resp)
          this.toastr.success('Marks submitted successfully')
          this.getAllSubjectDivision();
        } else {
          this.toastr.error('Marks submitted failed due to', resp.error)
        }
      },
      error => {
      },
    )
  }

  getPercentage(student) {
    let obtainedMarks = 0
    let maxMarks = 0
    if (student.subjects && student.subjects.subjectDivisions && student.subjects.subjectDivisions.length > 0) {
      student.subjects.subjectDivisions.forEach(element => {
        obtainedMarks = (obtainedMarks * 1) + (element.obtainedMarks * 1)
      });
      student.totalObtainedMarks=obtainedMarks;
      student.totalMaxMarks=this.totalMaxMarks;
      student.totalMinMarks=this.totalMinMarks;
      if (obtainedMarks > 0) {
        return ((obtainedMarks / this.totalMaxMarks) * 100).toFixed(2) + '%'
      } else {
        return '-'
      }
    } else {
      return '-'
    }
  }
}
