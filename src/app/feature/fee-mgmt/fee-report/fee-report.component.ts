 import { StudentMgmtService } from '../../../helpers/services/studentMgmt.service';
import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '../../../helpers/services/pagination.service';
import { AlertService, LoginUserService, SchoolMgmtService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import * as _ from 'underscore';
import { FeeService } from '../../../helpers/services/service';
import { StudentFilterPipe } from '../../../helpers/filters/filter';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Upload } from '../../../helpers/models/upload-file.models';
import { UploadService } from '../../../helpers/services/upload-file.service';
import { Util } from '../../../helpers/util'; 
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { NbThemeService, NbColorHelper } from '@nebular/theme';

@Component({
  selector: 'app-fee-report',
  templateUrl: './fee-report.component.html'
  // styles: ['.custom {color : blue}'],
})

export class FeeReportComponent implements OnInit {
  _router: Router;
    listFilter = '';
    url: string;
    model: any = {};
    loading = false;
    message: string;
    boards = ['CBSE', 'ICSE', 'IGCSE', 'State Board']
    fees: any = [];
    feeTypes: any = [];
    feeTerms: any = [];
    classes: any = [];
    summary: any =[];
    selectedClassList: any = [];
    selectedStudentsList: any = [];
    selectedFeeTermList: any = [];
    selectedFeeTypeList: any = [];
    feeReport: any = [];
    obj: any;
    students: any = [];
    bdata: any;
    boptions: any;
    themeSubscription: any;
    colors: any


    constructor(
        private router: Router,
        private modalService: NgbModal,
        private feeService: FeeService,
        private alert: AlertService,
        private auth: LoginUserService,
        private schoolService: SchoolMgmtService,
        vcr: ViewContainerRef,
        private theme: NbThemeService
    ) { 

    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      this.colors = config.variables;
      const chartjs: any = config.variables.chartjs;
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
  }


  ngOnInit() { 
    this.selectedClassList = [];
    this.selectedStudentsList = [];
    this.selectedFeeTermList = [];
    this.selectedFeeTypeList = [];
    this.model.selectedClass=null;
    this.model.selectedStudent=null;
    this.model.selectedFeeTerm=null;
    this.model.selectedFeeType=null;
    this.getTrendReport();
    this.getSummaryReport();
    this.getDropDownValues();
    this.getFeeTypes();
    this.getFeeTerms();
    //this.getFees();
  }

  parseResponseForBarChart(res) {
    const labels = [];
    const amount = [];
    if (res) {
      const currentYear = (new Date().getFullYear()) - 1;
      const mData=res;
      [1,2,3,4,5,6,7,8,9,10,11,12].forEach(ss => {
        var tt=false;
        mData.forEach(element => {
          if(element.mm===ss){
            amount.push(element.tamount || 0)
            var mm='-'+element.yy;
            tt=true;            
            switch (element.mm) {
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
          }
        });
        if(tt==false){                  
            amount.push(0);
            var mm=''; 
            switch (ss) {
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
        }
      });
      this.bdata = {
        labels: labels,
        datasets: [{
          data: amount,
          label: 'Collected Amount',
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.successLight, 1),
        }],
      };
    }
  }

  getTrendReport() {
        this.feeService.getTrendReport()
            .subscribe(
            trend => {
                if (trend) {
                  this.parseResponseForBarChart(trend);
                } else {
                    this.message = 'No records found!';
                }
            },
            error => {
                const errorData = this.auth.handleResponse(error);
                if (errorData) {
                    this.message = 'Something went wrong, Please try again later';
                    this.loading = false;
                } else {
                }
            },
        );
  }


  resetBarChart() {
    this.bdata = {
      labels: [],
      datasets: [{
        label: 'Collected Amount',
      }],
    };
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
    }else{   
      let cc=[];
      this.classes.forEach(function(item){
          cc.push(item.classID)
      });
      this.selectedClassList=cc;
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
      let cc=[];
      this.classes.forEach(function(item){
          cc.push(item.classID)
      });
      this.selectedClassList=cc;
  }

  getSchoolClassDetails(schoolId, isClassUpdate?: boolean) {
    this.schoolService.getSchoolDetail(schoolId)
      .subscribe(
      schoolDetail => {
        if (schoolDetail) {
          this.auth._schoolDetail = schoolDetail;
          this.auth.classDetail = schoolDetail.classDetails;
          this.classes = this.auth.classDetail;
          let cc=[];
          this.classes.forEach(function(item){
              cc.push(item.classID)
          });
          this.selectedClassList=cc;
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
    this.model.selectedClass = null;
    this.model.selectedStudent = null;
    this.model.selectedClass = event
    const detail = this.auth.schoolDetail;    
      this.selectedClassList=[];
      let cc=[];
      if(event!=null && event!=undefined){
          this.getAllStudents();   
          cc.push(event.classID);
          this.selectedClassList=cc;
      } else{
          let cc=[];
          this.classes.forEach(function(item){
              cc.push(item.classID)
          });
          this.selectedClassList=cc;
      }
      this.getReports(); 
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
                  let st=[];
                  this.students.forEach(function(item){
                      st.push(item.studentRollNo)
                  });
                  this.selectedStudentsList=st;
            } else {
            }
        },
    );
  }

  onChangeStudent(event) {
      this.selectedStudentsList=[];
      let st=[];
      if(event!=null && event!=undefined){
          st.push(event.studentRollNo);
          this.selectedStudentsList=st;
      }else{
          let st=[];
          this.students.forEach(function(item){
              st.push(item.studentRollNo)
          });
          this.selectedStudentsList=st;
      }   
      this.getReports();
  }

    
    getFeeTypes() {
        this.feeService.getFeeTypes()
            .subscribe(
            feeTypes => {
                if (feeTypes) {
                    this.feeTypes = feeTypes;
                    let fp=[];
                    this.feeTypes.forEach(function(item){
                      fp.push(item.feeTypeID)
                    });
                    this.selectedFeeTypeList=fp;
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
                }
            },
        );
    }
    onChangeFeeType(event) {
          this.selectedFeeTypeList=[];
          let fp=[];
          if(event!=null && event!=undefined){
              fp.push(event.feeTypeID);
              this.selectedFeeTypeList=fp;
          } else{
            let fp=[];
            this.feeTypes.forEach(function(item){
              fp.push(item.feeTypeID)
            });
            this.selectedFeeTypeList=fp;
          }  
          this.getReports();
     }

    getFeeTerms() {
        this.feeService.getFeeTerms()
            .subscribe(
            feeTerms => {
                if (feeTerms) {
                    this.feeTerms = feeTerms;
                    let ft=[]
                    this.feeTerms.forEach(function(item){
                      ft.push(item.feeTermID)
                    });
                    this.selectedFeeTermList=ft;
                } else {
                    this.message = 'No records found!';
                }
            },
            error => {
                const errorData = this.auth.handleResponse(error);
                if (errorData) {
                    this.message = 'Something went wrong, Please try again later';
                    this.loading = false;
                } else {
                }
            },
        );
    }
    onChangeFeeTerm(event) {
          this.selectedFeeTermList=[];
          let ft=[];
          if(event!=null && event!=undefined){
              ft.push(event.feeTermID);
              this.selectedFeeTermList=ft;
          } else{
            let ft=[]
            this.feeTerms.forEach(function(item){
              ft.push(item.feeTermID)
            });
            this.selectedFeeTermList=ft;
        }
          this.getReports();
    }

    getFees() {
        this.feeService.getFeeTypes()
            .subscribe(
            fees => {
                if (fees) {
                    this.fees = fees;
                } else {
                    this.message = 'No records found!';
                }
            },
            error => {
                const errorData = this.auth.handleResponse(error);
                if (errorData) {
                    this.message = 'Something went wrong, Please try again later';
                    this.loading = false;
                } else {
                }
            },
        );
    }

    getSummaryReport() {
        this.feeService.getSummaryReport()
            .subscribe(
            summary => {
                if (summary) {
                    this.summary = summary[0];
                } else {
                    this.message = 'No records found!';
                }
            },
            error => {
                const errorData = this.auth.handleResponse(error);
                if (errorData) {
                    this.message = 'Something went wrong, Please try again later';
                    this.loading = false;
                } else {
                }
            },
        );
    }

    getReports() {
        this.obj={};
        this.obj.selectedClassList=this.selectedClassList;
        this.obj.selectedStudentsList=this.selectedStudentsList;
        this.obj.selectedFeeTermList=this.selectedFeeTermList;
        this.obj.selectedFeeTypeList=this.selectedFeeTypeList;
        this.feeService.getReports(this.obj)
            .subscribe(
            feeReport => {
                if (feeReport) {
                    this.feeReport = feeReport;
                } else {
                    this.message = 'No records found!';
                }
            },
            error => {
                const errorData = this.auth.handleResponse(error);
                if (errorData) {
                    this.message = 'Something went wrong, Please try again later';
                    this.loading = false;
                } else {
                }
            },
        );
    }
}