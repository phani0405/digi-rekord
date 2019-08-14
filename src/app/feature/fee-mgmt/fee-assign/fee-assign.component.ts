 import { StudentMgmtService } from '../../../helpers/services/studentMgmt.service';
import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '../../../helpers/services/pagination.service';
import { AlertService, LoginUserService, SchoolMgmtService, FeeService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import * as _ from 'underscore';
import { InstituteService, ReportsService } from '../../../helpers/services/service';
import { StudentFilterPipe } from '../../../helpers/filters/filter';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UploadService } from '../../../helpers/services/upload-file.service';
import { Util } from '../../../helpers/util'; 
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-fee-assign',
  templateUrl: './fee-assign.component.html',
  styleUrls: ['./fee-assign.component.scss'],
  // styles: ['.custom {color : blue}'],
})

export class FeeAssignComponent implements OnInit {
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
  titleText: string;
  modalReference: any;
  classMode: any;
  bdata: any;
  pdata: any;
  poptions: any;
  boptions: any;
  themeSubscription: any;
  colors: any
  schoolIdUpdateEvent: any;
  childrenUpdateEvent: any;
  csvOptions: any;
  csvFeeData: any[];
  closeResult: any;
  fees: any;
  student: any;


  constructor(
    private alert: AlertService,
    private auth: LoginUserService,
    private schoolService: SchoolMgmtService,
    private reportsService: ReportsService,
    private modalService: NgbModal,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    private feeService: FeeService,
    public util: Util
  ) {    
    this.csvOptions = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: false, 
            showTitle: false,
            useBom: true,
            headers: []
        };
    this.toastr.setRootViewContainerRef(vcr);    
    this.getDropDownValues();
  }

  ngOnInit() {
  }

  exportFeeDetails(){
      this.csvOptions.headers=['Student Name', 'Student Roll No.', 'Class Name', 'Total Days', 'Days Attended', 'Present Percentage', 'Absent Percentage'];
      new Angular2Csv(this.csvFeeData, 'StudentAttendanceReport('+this.model.selectedClass.className+')', this.csvOptions);
  }

  getSelectedDDValues() {
    return {
      classID: this.model.selectedClass.classID,
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
    if (!this.classes) {
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
          this.classes = this.auth.classDetail;
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
    this.getAllStudents();
    console.log('selected class', event, this.subjects)
  }

  onChangeSubject(event) {
    this.model.selectedSubject = event
    console.log('selected subject', event)
  }
  getAllStudents() {
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    this.feeService.getStudents({schoolId:schoolId, classId:this.model.selectedClass.classID})
    .subscribe(
        students => {
            if (students) {
                this.students = students.sort(function(a, b) {
                    return (a.createdDate < b.createdDate) ? 1 : ((b.createdDate < a.createdDate) ? -1 : 0);
                });
                // this.setPage(1, this.students);
                // if (this.selectedClassObj && Object.keys(this.selectedClassObj).length > 0) {
                //     this.filterStudent();
                // }
            } else {
            }
        },
    );
  }
  open(content, student) {     
      this.fees = [];
      this.student=student;
      this.getAssignedFeesStudentwise(student);
      this.titleText="Assign Fee";
      this.modalReference = this.modalService.open(content, { size: 'lg' });
      this.modalReference.result.then((result) => {
          this.resetModelAndMessage();
          this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }
  private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdp';
      } else {
          this.resetModelAndMessage();
          return `with: ${reason}`;
      }
  }
  resetModelAndMessage() {
      this.model.collection = {};
      this.message = '';
  }
  getAssignedFeesStudentwise(student) {
    this.feeService.getAssignedFeesStudentwise(student.studentRollNo)
        .subscribe(
        fees => {
            if (fees) {
                this.fees = fees;
            } else {
                this.message = 'No record found!';
            }
        },
        error => {
            const errorData = this.auth.handleResponse(error);
            if (errorData) {
                this.message = 'Something went wrong, Please try again later';
                this.loading = false;
            } else {
                this.modalReference.dismiss('Manually');
            }
        },
    );
  }
  assignFee(fee) {
        fee.studentRollNo=this.student.studentRollNo;
        this.feeService.assignFeeStudentWise(fee)
            .subscribe(
            fees => {
                if (fees) {
                    //this.modalReference.dismiss('Manually');
                } else {
                    this.message = 'Unable to create, Please try again later';
                }
            },
            error => {
                const errorData = this.auth.handleResponse(error);
                if (errorData) {
                    this.message = 'Something went wrong, Please try again later';
                    this.loading = false;
                } else {
                    this.modalReference.dismiss('Manually');
                }
            },
        );
    }
}
