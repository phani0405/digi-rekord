import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { LoginUserService, AlertService, AttendanceMgmtService, SchoolMgmtService} from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';

import { filter } from 'rxjs/operator/filter';

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.scss'],
})
export class MarkAttendanceComponent implements OnInit {

  _router: Router;
  listFilter= '';
  url: string;
  model: any = {
    selectedClass: null,
    selectedSession: null
  };
  loading = false;
  message: string;
  titleText: string;
  modalReference: any;
  classMode: any;
  sessions: any = [
    {key: 1, value: 'Morning'},
    {key: 2, value: 'Afternoon'},
  ];
  classes: any = [];
  students: any;
  obj: any;

    constructor(
        private router: Router,
        private modalService: NgbModal,
        private alert: AlertService,
        private auth: LoginUserService,
        private attendanceService: AttendanceMgmtService,
        public toastr: ToastsManager, vcr: ViewContainerRef,
        private schoolService: SchoolMgmtService,
    ) {
        this.toastr.setRootViewContainerRef(vcr);
        if (this.auth.userRole().toLowerCase() === 'parent') {
          this.classes = this.auth.getAllClasses();
        } else {
          this.getDropDownValues()
        }
     }

    ngOnInit() {
        // this.classes = this.auth.classDetail;
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
            this.auth.termDetail = schoolDetail.termDetails;
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

    openPreviewModel(content) {
        this.model.studentPresent = 0
        this.model.studentAbsent = 0
        const sa = this.students.attendanceReport;
        sa.forEach(element => {
          // delete element['present']
          if(element.present) {
            this.model.studentPresent = this.model.studentPresent + 1;
          } else {
            this.model.studentAbsent = this.model.studentAbsent + 1;
          }
        });
        this.model.totalStudent = this.model.studentPresent + this.model.studentAbsent;

        this.modalReference = this.modalService.open(content);
    }

    onChangeClass(event) {
      this.model.selectedClass = event;
    }

    onChangeSession(session) {
      this.model.selectedSession = session;
    }

    onSelectionChange(event, data, student) {
      if(data === 'present') {
        student.periodWiseDetails.daysPresent.push(this.model.date.day)
        student.periodWiseDetails.daysAbsent.pop(this.model.date.day)
        student.present = true
      }
      if(data === 'absent') {
        student.periodWiseDetails.daysAbsent.push(this.model.date.day)
        student.periodWiseDetails.daysPresent.pop(this.model.date.day)
        student.present = false
      }
    }

    getStudentsForAttendance() {

      const data = {
        schoolID : this.auth.registeredDetails()[0].schoolID ? this.auth.registeredDetails()[0].schoolID : '',
        classID: this.model.selectedClass.classID,
        date: this.model.date.day,
        month: this.model.date.month,
        year: this.model.date.year,
        periodID: this.model.selectedSession.key
      }
      this.attendanceService.getStudentsForAttendance(data).subscribe(
        resp=>{
          if(!resp.error) {
            console.log("resp", resp);
            // const resp = {"attendanceReport":[{"attendanceID":"f5b5e580-e5a6-11e7-b360-17699f9bea68","studentID":"f41ef1d0-e5a6-11e7-b360-17699f9bea68","periodWiseDetails":{"attendanceTaken":[28],"daysPresent":[],"daysAbsent":[28],"periodID":1}},{"attendanceID":"89fd1930-e984-11e7-b42b-5db794495518","studentID":"884f6930-e984-11e7-b42b-5db794495518","periodWiseDetails":{"attendanceTaken":[28],"daysPresent":[28],"daysAbsent":[],"periodID":1}},{"attendanceID":"878c2010-eabf-11e7-a5dc-1bb0f5a29c55","studentID":"862b0970-eabf-11e7-a5dc-1bb0f5a29c55","periodWiseDetails":{"periodID":1,"daysAbsent":[],"daysPresent":[28],"attendanceTaken":[28]}}],"noOfDays":31,"schoolID":"6d238b60-e5a5-11e7-b360-17699f9bea68","classID":"c70afc80-e5a5-11e7-b360-17699f9bea68","month":12}
            this.students = resp.attendanceReport ? resp : [];
            if(this.students.attendanceReport) {
              this.students.attendanceReport = this.students.attendanceReport.map(s => {
                if(s.periodWiseDetails.daysPresent.indexOf(data.date) > -1 ) {
                  s.present = true;
                }
                if(s.periodWiseDetails.daysAbsent.indexOf(data.date) > -1 ) {
                  s.present = false;
                }
                return s;
              })
            }
          } else {
            this.toastr.error(resp.error);
          }
        },
        error => {
          this.toastr.error('Submitting attendance failed, Please try again later');
        }
      ) 
    }

    submitAttendance() {
      this.attendanceService.submitAttendance(this.students).subscribe(
        resp => {
          if(!resp.error) {
            this.toastr.success('Attendance submitted successfully');
            this.triggerSMS(resp, this.students);
            this.modalReference.dismiss('Manually');
          } else {
            this.toastr.error(resp.error);
            this.modalReference.dismiss('Manually');
          }
        },
        error => {
          this.toastr.error('Submitting attendance failed, Please try again later');
          this.modalReference.dismiss('Manually');
        }
      )
    }
    triggerSMS(data, req){
        this.obj={};
        this.obj.instituteID=this.auth.instituteID();
        this.obj.date=req.noOfDays+'-'+req.month+'-'+req.year;
        this.obj.mobileNos=data.mobileNos;
        this.attendanceService.triggerSMS(this.obj)
            .subscribe(
            data => {
                if (!data.error) {
                    this.toastr.success('Absent alerts sent successfully');
                } else {
                    this.message = data.error;
                    this.loading = false;
                }
            },
            error => {
                const errorData = this.auth.handleResponse(error);
                if (errorData) {
                    this.message = 'Something went wrong, Please try again later';
                    this.loading = false;
                } else {
                    // this.modalReference.dismiss('Manually');
                }
            });
    }
}
