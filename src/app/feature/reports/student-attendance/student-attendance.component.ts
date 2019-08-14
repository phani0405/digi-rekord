 import { StudentMgmtService } from '../../../helpers/services/studentMgmt.service';
import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '../../../helpers/services/pagination.service';
import { AlertService, LoginUserService, SchoolMgmtService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import * as _ from 'underscore';
import { InstituteService, ReportsService } from '../../../helpers/services/service';
import { StudentFilterPipe } from '../../../helpers/filters/filter';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Upload } from '../../../helpers/models/upload-file.models';
import { UploadService } from '../../../helpers/services/upload-file.service';
import { Util } from '../../../helpers/util'; 
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { NbThemeService, NbColorHelper } from '@nebular/theme';

@Component({
  selector: 'app-attendance-reports',
  templateUrl: './student-attendance.component.html',
  styleUrls: ['./student-attendance.component.scss'],
  // styles: ['.custom {color : blue}'],
})

export class StudentAttendanceReportComponent implements OnInit {
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


  constructor(
    private alert: AlertService,
    private auth: LoginUserService,
    private schoolService: SchoolMgmtService,
    private reportsService: ReportsService,
    private modalService: NgbModal,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    public util: Util,
    private theme: NbThemeService
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
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      this.colors = config.variables;
      const chartjs: any = config.variables.chartjs;

      this.poptions = {
        maintainAspectRatio: false,
        responsive: true,
        scale: {
          pointLabels: {
            fontSize: 14,
            fontColor: chartjs.textColor,
          },
        },
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
        legend: {
          labels: {
            fontColor: chartjs.textColor,
          },
        },
      };

      this.boptions = {
        maintainAspectRatio: false,
        responsive: true,
        scaleStartValue: 0,
        legend: {
          labels: {
            fontColor: chartjs.textColor,
          },
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
        },
      };
    });  
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
    this.getClassAttendanceForBarChart(this.auth.getSchoolID(), this.model.selectedClass.classID, true);
    this.getClassAttendanceForPieChart(this.auth.getSchoolID(), this.model.selectedClass.classID, true);
    this.getClassAttendanceWithStudents(this.auth.getSchoolID(), this.model.selectedClass.classID, this.model.selectedClass.className, true);
    console.log('selected class', event, this.subjects)
  }

  onChangeSubject(event) {
    this.model.selectedSubject = event
    console.log('selected subject', event)
  }

  resetBarChart() {
    this.bdata = {
      labels: [],
      datasets: [{
        label: 'Present',
      }, {
        label: 'Absent',
      }],
    };
  }

  resetPieChart() {
    this.pdata = {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
      }],
    };
  }

  parseResponseForBarChart(res) {
    const labels = [];
    const present = [];
    const absent = [];
    if (res.monthWiseDetails) {
      const currentYear = (new Date().getFullYear()) - 1;

      // const modifyData = res.monthWiseDetails.map((i) => {
      //   if (i.year === null) {
      //     i.year = currentYear
      //   }
      //   return i;
      // })
      // console.log(modifyData);
      // const mData = modifyData.sort((a, b) => {
      //   const d = new Date(b.year, b.month - 1);
      //   const c = new Date(a.year, a.month - 1);
      //   return (d > c) ? 1 : ((d < c) ? -1 : 0);
      // });
      // console.log(mData);
      const mData=res.monthWiseDetails;
      mData.forEach(element => {
        present.push(element.daysPresent || 0)
        absent.push(element.daysAbsent || 0)
        var mm=element.year?("-"+element.year):"";
        switch (element.month) {
          case 1:
            labels.push("Jan"+mm)
            break;
          case 2:
            labels.push("Feb"+mm)
            break;
          case 3:
            labels.push("Mar"+mm)
            break;
          case 4:
            labels.push("Apr"+mm)
            break;
          case 5:
            labels.push("May"+mm)
            break;
          case 6:
            labels.push("Jun"+mm)
            break;
          case 7:
            labels.push("Jul"+mm)
            break;
          case 8:
            labels.push("Aug"+mm)
            break;
          case 9:
            labels.push("Sep"+mm)
            break;
          case 10:
            labels.push("Oct"+mm)
            break;
          case 11:
            labels.push("Nov"+mm)
            break;
          case 12:
            labels.push("Dec"+mm)
            break;
        }
      });
      this.bdata = {
        labels: labels,
        datasets: [{
          data: present,
          label: 'Present',
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.successLight, 1),
        }, {
          data: absent,
          label: 'Absent',
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.danger, 1),
        }],
      };
    }
  }

  parseResponseForPiChart(res) {
    if (res.length > 0) {
      this.pdata = {
        labels: ['Present', 'Absent'],
        datasets: [{
          data: [res[0].daysPresent, res[0].daysAbsent],
          backgroundColor: [this.colors.successLight, this.colors.danger],
        }],
      };
    } else {
      this.resetPieChart()
      this.toastr.warning("No Attendance Details found for this school")
    }
  }

  getClassAttendanceForPieChart(schoolId, classId, isClassUpdate?: boolean) {
    this.reportsService.getClassAttendanceForPieChart(schoolId, classId)
      .subscribe(
      res => {
        if (res && !(res.error || res.message)) {
          this.parseResponseForPiChart(res)
        } else {
          this.resetPieChart()
          this.toastr.warning("No Attendance Details found for this school")
        }
      },
      error => {
      },
    );
  }
  getClassAttendanceForBarChart(schoolId, classId, isClassUpdate?: boolean) {
    this.reportsService.getClassAttendanceForBarChart(schoolId, classId)
      .subscribe(
      res => {
        if (res && !(res.error || res.message)) {
          this.parseResponseForBarChart(res)
        } else {
          this.resetBarChart()
          this.toastr.warning("No Attendance Details found for this school")
        }
      },
      error => {
      },
    );
  }
  getClassAttendanceWithStudents(schoolId, classId, className, isClassUpdate?: boolean) {
    this.reportsService.getClassAttendanceWithStudents(schoolId, classId)
      .subscribe(
      students => {
          if (students) {   
              this.students = students.sort(function(a,b) {
                if (a.studentName < b.studentName)
                  return -1;
                if (a.studentName > b.studentName)
                  return 1;
                return 0;
              });              
              this.students = students;

              var obj={};  
              var sss=[];
              students.forEach(function(item){
                  obj = {
                      'studentName':item.studentName,
                      'studentRollNo':item.studentRollNo,
                      'className':className,
                      'totalDays':item.attendanceTaken,
                      'daysAttended':item.daysPresent,
                      'presentPercentage':item.presentPercentage,
                      'absentPercentage':item.absentPercentage,
                  }
                  sss.push(obj);
              });
              this.csvFeeData=sss;
          } else {
          }
      },
      error => {
      },
    );
  }
}
