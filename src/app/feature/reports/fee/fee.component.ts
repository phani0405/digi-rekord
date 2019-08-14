 import { StudentMgmtService } from '../../../helpers/services/studentMgmt.service';
import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '../../../helpers/services/pagination.service';
import { AlertService, LoginUserService, SchoolMgmtService } from '../../../helpers/services/service';
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
  selector: 'app-fee-reports',
  templateUrl: './fee.component.html',
  styleUrls: ['./fee.component.scss'],
  // styles: ['.custom {color : blue}'],
})

export class FeeReportComponent implements OnInit {
  _router: Router;
  listFilter= '';
  students: any;
  studentDetail: any;
  selectedStudentDetail: any;
  pager: any = {};
  pagedItems: any[];
  modalReference: any;
  closeResult: string;
  url: string;
  model: any = {
  };
  loading = false;
  message: string;
  genders = [
    { value: 'Male', display: 'Male' },
    { value: 'Female', display: 'Female' },
  ];
  classes: any;
  selectedUserClass: any;
  classesForSort: any;
  selectedClassObj: any;
  currentUpload: Upload;
  uploadingImageLoading: any;
  deleteModelReference : any;
  searchText: string;
  csvOptions: any;
  csvFeeData: any[];
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private alertService: AlertService,
        private pagerService: PagerService,
        private auth: LoginUserService,
        private schoolService: SchoolMgmtService,
        private studentService: StudentMgmtService,
        public toastr: ToastsManager, vcr: ViewContainerRef,
        private upSvc: UploadService,
        public util: Util,
    ) {
        this.toastr.setRootViewContainerRef(vcr);

        this.csvOptions = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: false, 
            showTitle: false,
            useBom: true,
            headers: []
        };
     }

    ngOnInit() {
        this.getAllStudents();
        this.getSchoolClassDetails();     
    }

    isNaN = function(value){ //or $scope.isNaN = function(value){
    return isNaN(value);
    }

    exportFeeDetails(){
        this.csvOptions.headers=['Student Name', 'Student Roll No.', 'Class Name', 'Total Amount', 'Piad Amount', 'Balance Amount'];
        new Angular2Csv(this.csvFeeData, 'FeeReport('+this.model.selectedClass.className+')', this.csvOptions);
    }

    getAllStudents() {
        const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
        this.studentService.getStudents(schoolId)
        .subscribe(
            students => {
                if (students) {     
                    this.students = students.sort(function(a, b) {
                        return (a.createdDate < b.createdDate) ? 1 : ((b.createdDate < a.createdDate) ? -1 : 0);
                    });            
                    var obj={};  
                    var sss=[];
                    this.students.forEach(function(item){
                        obj = {
                            'studentName':item.studentName,
                            'studentRollNo':item.studentRollNo,
                            'className':item.className,
                            'totalFee':item.totalFee?item.totalFee:0,
                            'balanceFee':item.balanceFee?item.balanceFee:0,
                            'paidAmount':isNaN(item.totalFee - item.balanceFee)?0:(item.totalFee - item.balanceFee)
                        }
                        sss.push(obj);
                    });
                    this.csvFeeData=sss;
                    this.setPage(1, this.students);
                    if (this.selectedClassObj && Object.keys(this.selectedClassObj).length > 0) {
                        this.filterStudent();
                    }
                } else {
                }
            },
        );
    }

    getSchoolClassDetails() {
        const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
        this.schoolService.getSchoolDetail(schoolId)
        .subscribe(
            schoolDetail => {
                if (schoolDetail) {
                    this.auth.schoolDetail = schoolDetail;
                    this.auth.classDetail = JSON.parse(JSON.stringify(schoolDetail.classDetails));
                    this.classes = JSON.parse(JSON.stringify(schoolDetail.classDetails));
                    this.classesForSort = schoolDetail.classDetails;
                    this.classesForSort.unshift({className: 'All', classID: 'All'});
                    this.selectedClassObj = this.classesForSort[0];
                } else {
                }
            },
            error => {
            },
        );
    }

    setPage(page: number, students? : any) {

        students = students ? students : this.students
        if (page < 1 || page > this.pager.totalPages && (students.length < 0 )) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(students.length, page);
        // get current page of items
        this.pagedItems = students.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }


    getGenderValue(selectedGender) {
        const genderValue = this.genders.filter((gender) =>  gender.value === selectedGender);
        return genderValue && genderValue.length > 0 ? genderValue[0].value : 'Male';

    }

    filterStudent() {
        let sCopy = JSON.parse(JSON.stringify(this.students));
        if (this.selectedClassObj && this.selectedClassObj.classID !== 'All') {
            sCopy = sCopy.filter(s => {
                if (s.classID === this.selectedClassObj.classID) {
                    return true;
                } else {
                    return false;
                }
            });
        }
        sCopy = sCopy.sort(function(a, b) {
            return (a.createdDate < b.createdDate) ? 1 : ((b.createdDate < a.createdDate) ? -1 : 0);
        });
        var obj;
        var ass=[];
        sCopy.forEach(function(item){
            obj = {
                'studentName':item.studentName,
                'studentRollNo':item.studentRollNo,
                'className':item.className,
                'totalFee':item.totalFee?item.totalFee:0,
                'balanceFee':item.balanceFee?item.balanceFee:0,
                'paidAmount':isNaN(item.totalFee - item.balanceFee)?0:(item.totalFee - item.balanceFee)
            }
            ass.push(obj);
        });
        this.csvFeeData=ass;
        if (sCopy.length > 0) {
            this.setPage(1, sCopy);
        } else {
            this.pagedItems = sCopy;
        }
    }

    onChangeClass(event: any, query: string) {
        if (query === 'update') {
            this.selectedUserClass = event;
        }
         if (query === 'filter') {
            this.selectedClassObj = event;
            this.filterStudent();
         }
    }

    byId(item1, item2) {
        if (item1 && item2 && item1.classID && item2.classID) {
            return item1.classID === item2.classID;
        } else {
            return false;
        }
    }

}
