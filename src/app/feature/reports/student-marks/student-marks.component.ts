 import { StudentMgmtService } from '../../../helpers/services/studentMgmt.service';
import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '../../../helpers/services/pagination.service';
import { AlertService, LoginUserService, SchoolMgmtService, ReportsService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import * as _ from 'underscore';
import { InstituteService } from '../../../helpers/services/service';
import { StudentFilterPipe } from '../../../helpers/filters/filter';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Upload } from '../../../helpers/models/upload-file.models';
import { UploadService } from '../../../helpers/services/upload-file.service';
import { Util } from '../../../helpers/util'; 
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-smarks-reports',
  templateUrl: './student-marks.component.html',
  styleUrls: ['./student-marks.component.scss'],
  // styles: ['.custom {color : blue}'],
})

export class StudentMarksReportComponent implements OnInit {
  model: any = {
    selectedClass: null
  };
  loading = false;
  message: string;
  classes: any = [];
  students: any
  marksScored: any
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
  dShow:boolean = false;
  dSShow:boolean = false;

  constructor(
    private alert: AlertService,
    private auth: LoginUserService,
    private schoolService: SchoolMgmtService,
    private reportsService: ReportsService,
    private modalService: NgbModal,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    public util: Util,
    private router: Router
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
    if(event.classID && this.model.selectedTerm && this.model.selectedTerm.termInstituteID){
      this.dShow=true;
      this.getTotalMarksForStudents();
    }
    else{
      this.dShow=false;
    }
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
    if(event.termInstituteID && this.model.selectedClass && this.model.selectedClass.classID)
      this.dShow=true;
    else
      this.dShow=false;
    console.log('selected term', event)
  }

  onChangeSubject(event) {
    this.model.selectedSubject = event
    if(event.subjectID && this.model.selectedClass && this.model.selectedClass.classID && this.model.selectedTerm && this.model.selectedTerm.termInstituteID)
      this.dSShow=true;
    else
      this.dSShow=false;
    console.log('selected subject', event)
  }

  downloadAllSubjectsMarkSheet(){
    var allIDS=this.getSelectedDDValues();
    this.reportsService.getAllSubjectsMarkSheet(allIDS.schoolID,allIDS.classID,allIDS.termID)
      .subscribe(
      response => {
        if (response.fileUrl) {
          window.open(response.fileUrl,'_blank');
        }
      },
      error => {
      },
    );
  }
  downloadAllSubjectDivisionMarkSheet(){
    var allIDS=this.getSelectedDDValues();
    this.reportsService.getAllSubjectDivisionMarkSheet(allIDS.schoolID,allIDS.classID,allIDS.termID)
      .subscribe(
      response => {
        if (response.fileUrl) {
          window.open(response.fileUrl,'_blank');
        }
      },
      error => {
      },
    );
  }
  downloadSubjectWiseMarkSheet(){
    var allIDS=this.getSelectedDDValues();
    this.reportsService.getSubjectWiseMarkSheet(allIDS.schoolID,allIDS.classID,this.model.selectedSubject.subjectID,allIDS.termID)
      .subscribe(
      response => {
        if (response.fileUrl) {
          window.open(response.fileUrl,'_blank');
        }
      },
      error => {
      },
    );
  }
  getTotalMarksForStudents(){
    var allIDS=this.getSelectedDDValues();
    this.reportsService.getTotalMarksForStudents(allIDS.schoolID,allIDS.classID,allIDS.termID)
      .subscribe(
      response => {
        if (response.marksReportDetails && response.marksReportDetails.students) {
          this.students = response.marksReportDetails.students.sort(function(a,b) {
            if (a.rank < b.rank)
              return -1;
            if (a.rank > b.rank)
              return 1;
            return 0;
          });              
          this.students = response.marksReportDetails.students;
          this.marksScored = response.marksScored;
        }
      },
      error => {
      },
    );
  }
}
