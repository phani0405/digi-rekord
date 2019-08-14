import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { LoginUserService, AlertService, AttendanceMgmtService, SchoolMgmtService} from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';

import { filter } from 'rxjs/operator/filter';

@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.component.html',
  styleUrls: ['./view-attendance.component.scss']
})
export class ViewAttendanceComponent implements OnInit {

  _router: Router;
  listFilter= '';
  url: string;
  model: any = {
    selectedClass: null
  };
  loading = false;
  message: string;
  titleText: string;
  modalReference: any;
  classMode: any;
  classes: any = [];
  students: any;
  attendanceDetails: any = {
    details: [],
    studentName: '',
    studentRollNumber: ''
  };


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

    onChangeClass(event) {
      this.model.selectedClass = event;
    }

    getRequestData() {
      return {
        schoolID : this.auth.registeredDetails()[0].schoolID ? this.auth.registeredDetails()[0].schoolID : '',
        classID: this.model.selectedClass.classID,
        studentID: '',
        from: {
          date: this.model.fromDate.day,
          month: this.model.fromDate.month,
          year: this.model.fromDate.year,
        },
        to: {
          date: this.model.toDate.day,
          month: this.model.toDate.month,
          year: this.model.toDate.year,
        }
      }
    }

    getAttendance() {

      const data = this.getRequestData()
      this.attendanceService.getOverAllAttendance(data).subscribe(
        resp=>{
          if(!resp.error) {
            console.log("resp", resp);
            // const resp = {"attendanceReport":[{"attendanceID":"f5b5e580-e5a6-11e7-b360-17699f9bea68","studentID":"f41ef1d0-e5a6-11e7-b360-17699f9bea68","periodWiseDetails":{"attendanceTaken":[28],"daysPresent":[],"daysAbsent":[28],"periodID":1}},{"attendanceID":"89fd1930-e984-11e7-b42b-5db794495518","studentID":"884f6930-e984-11e7-b42b-5db794495518","periodWiseDetails":{"attendanceTaken":[28],"daysPresent":[28],"daysAbsent":[],"periodID":1}},{"attendanceID":"878c2010-eabf-11e7-a5dc-1bb0f5a29c55","studentID":"862b0970-eabf-11e7-a5dc-1bb0f5a29c55","periodWiseDetails":{"periodID":1,"daysAbsent":[],"daysPresent":[28],"attendanceTaken":[28]}}],"noOfDays":31,"schoolID":"6d238b60-e5a5-11e7-b360-17699f9bea68","classID":"c70afc80-e5a5-11e7-b360-17699f9bea68","month":12}
            this.students = resp;
          } else {
            this.toastr.error(resp.error);
          }
        },
        error => {
          this.toastr.error('Submitting attendance failed, Please try again later');
        }
      ) 
    }

    getPeriodWiseDetail(period, session) {
      if (session === 1 || session === 2 ) {
        const s = period.filter(p => {
          return p.periodID === session;
        });
        if(s[0].attendanceTaken==0){          
          return '-';
        }
        else{
          return ((s[0].daysPresent/s[0].attendanceTaken)*100).toFixed(2) + '%';
        }
      }

      if(session === 3 ) {
        if((period[0].attendanceTaken + period[1].attendanceTaken)==0){
          return '-';
        }
        else{
          return (((period[0].daysPresent + period[1].daysPresent) / (period[0].attendanceTaken + period[1].attendanceTaken)) * 100).toFixed(2) + '%' ;
        }
      }
    }

  modifyDetailResp(d) {
      let per = (d[0].periodWiseDetails);
      // console.log(per[0])
      let md = [];
      per.forEach(e => {
          if(e.periodID === 1) {
              e.periodID = "Morning"
          }
          if(e.periodID === 2) {
              e.periodID = "AfterNoon"
          }
          e.dateWise.sort( (a,b) => {
              const d = new Date(b.year, b.month -1, b.day);
              const c = new Date(a.year, a.month -1, a.day);
              return (d < c) ? 1 : ((d > c) ? -1 : 0);
          });
          md.push(e);
      })
      return md;
  }

    openAttendanceDetailMedel(model, student) {
      const data = this.getRequestData();
      data.studentID = student.studentID;
      this.attendanceService.getStudentAttendanceDetail(data)
        .subscribe(
            resp => {
                if (resp || !resp.error) {
                    console.log("student Details :",resp);
                    this.attendanceDetails.details = this.modifyDetailResp(resp);
                    this.attendanceDetails.studentName = student.studentName;
                    this.attendanceDetails.studentRollNo = student.studentRollNo;
                    this.modalService.open(model, {size : 'lg'});
                } else {
                }
            },
            error => {
            },
        );
    }

}
