import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '../../../helpers/services/pagination.service';
import { LeaveMgmtService, AlertService, LoginUserService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.scss']
})
export class LeaveListComponent implements OnInit {
  @Input() leaveType: string;
  _router: Router;
  listFilter= '';
  leaves: any;
  staffLeaves: any;
  studentLeaves: any;
  pager: any = {};
  pagedItems: any[];
  modalReference: any;
  closeResult: string;
  url: string;
  isApproveLeaves: boolean;
  model: any = {
  };
  loading = false;
  message: string;
  leaveApplyAllowd: boolean;
  isParent: boolean;
  showTwoTables: boolean;
  showOneTable: boolean;
  sName: string;
  srole: string;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private leaveMgmtService: LeaveMgmtService,
    private alertService: AlertService,
    private pagerService: PagerService,
    private auth: LoginUserService,
  ) { 
    
  }

  ngOnInit() {
    const role = this.auth.userRole().toLocaleLowerCase();
    const staffRole= this.auth.staffRole().toLocaleLowerCase();
    if(role=='schooladmin')
    {
      this.srole='schooladmin';
      this.sName=this.auth.getUserName(role);
    }
    this.isApproveLeaves= (staffRole === 'principal' || role === 'teachingstaff' ) ? true : false;
    this.leaveApplyAllowd = this.leaveType === 'MyLeaves' ? true : false;
    this.isParent = (role === 'parent') ? true : false;
    this.getLeaves();
  }

    getLeaves() {
        this.staffLeaves=[];
        this.pagedItems=[];
        const role = this.auth.userRole().toLocaleLowerCase();
        const staffRole= this.auth.staffRole().toLocaleLowerCase();
        this.showTwoTables = (this.leaveType === 'LeaveForApproval' && role === 'teachingstaff' && staffRole === 'principal') ? true : false;    
        this.showOneTable = (this.leaveType === 'LeaveForApproval' && role === 'teachingstaff' && staffRole === 'staff') ? true : false;
        this.isApproveLeaves= (staffRole === 'principal' || role === 'teachingstaff' ) ? true : false;
        if (this.leaveType === 'MyLeaves' && (role === 'teachingstaff' && staffRole === 'principal')) {
            //this.getAllLeaves();
            this.getStaffLeaves();
        } else if(this.leaveType === 'MyLeaves' && (role === 'teachingstaff' && staffRole !== 'principal' )) {
            this.getStaffLeaves();
        } else if(this.leaveType === 'MyLeaves' && (role === 'schooladmin')) {
            this.getStaffLeaves();
        } else if(this.leaveType === 'MyLeaves' && (role === 'nonteachingstaff')) {
            this.getStaffLeaves();
        } else if(this.leaveType === 'MyLeaves' && (role === 'parent')) {
            this.getAllLeaves();
        } else if (this.leaveType === 'LeaveForApproval' && (role === 'teachingstaff' && staffRole === 'principal' )) {
            this.getAllApproveLeaves();
            this.getStaffApproveLeaves();
        } else if (this.leaveType === 'LeaveForApproval' && (role === 'teachingstaff' && staffRole === 'staff' )) {
            this.getAllApproveLeaves();
        }
    }

  getAllLeaves() {
    const userId = this.auth.userId();
    const isApproveLeaves= this.isApproveLeaves ? "yes" : "no";
    this.leaveMgmtService.getLeaves(userId, isApproveLeaves)
    .subscribe(
        leaves => {
            if (leaves && !leaves.error) {
                this.leaves = leaves;
                this.setPage(1);
            } else {
              this.leaves = [];
              this.setPage(1);
            }
        },
    );
  }

  getStaffLeaves() {
    const userId = this.auth.userId();
    const isApproveLeaves= this.isApproveLeaves ? "yes" : "no";
    this.leaveMgmtService.getStaffLeaves(userId,"no")
    .subscribe(
        leaves => {
            if (leaves && !leaves.error) {
                this.leaves = leaves;
                this.setPage(1);
            } else {
              this.leaves = [];
              this.setPage(1);
            }
        },
    );
  }

  getAllApproveLeaves() {
    const userId = this.auth.userId();
    const isApproveLeaves= this.isApproveLeaves ? "yes" : "no";
    this.leaveMgmtService.getLeaves(userId, "yes")
    .subscribe(
        leaves => {
            if (leaves && !leaves.error) {
                this.leaves = leaves;
                this.setPage(1);
            } else {
              this.leaves = [];
              this.setPage(1);
            }
        },
    );
  }

  getStaffApproveLeaves() {
    const userId = this.auth.userId();
    const isApproveLeaves= this.isApproveLeaves ? "yes" : "no";
    this.leaveMgmtService.getStaffLeaves(userId,"yes")
    .subscribe(
        leaves => {
            if (leaves && !leaves.error) {
                this.staffLeaves = leaves;
                //this.setPage(1);
            } else {
              this.staffLeaves = [];
              //this.setPage(1);
            }
        },
    );
  }

  approveLeave(leaveDetail, status){
    this.model={};
    this.model.leaveID = leaveDetail.leaveID;
    this.model.studentID = leaveDetail.studentID;
    this.model.parentID = leaveDetail.parentID;
    this.model.parentName = leaveDetail.parentName;
    this.model.studentRollNo= leaveDetail.studentRollNo;
    this.model.studentName= leaveDetail.studentName;
    this.model.classID= leaveDetail.classID;
    this.model.schoolID = leaveDetail.schoolID;
    this.model.fromDate = leaveDetail.fromDate;
    this.model.toDate = leaveDetail.toDate;
    this.model.noOfDays = leaveDetail.noOfDays;
    this.model.leaveReason = leaveDetail.leaveDetail;
    this.model.leaveStatus= status;
    this.model.updatedBy= this.auth.userId();
    this.leaveMgmtService.approveLeave(this.model)
    .subscribe(
        data => {
            if (!data.error) {
                this.getAllLeaves();
                this.model = {};
                this.message = '';
            } else {
                this.message = data.error;
                this.loading = false;
            }
        },
        error => {
            const errorData = this.auth.handleResponse(error);
            if (errorData) {
                this.message = 'Something went wrong, Please try again later' ;
                this.loading = false;
            } 
        });
      
  }
  approveStaffLeave(leaveDetail, status){
    this.model={};
    this.model.leaveID = leaveDetail.leaveID;
    this.model.staffID = leaveDetail.staffID;
    this.model.schoolID = leaveDetail.schoolID;
    this.model.fromDate = leaveDetail.fromDate;
    this.model.toDate = leaveDetail.toDate;
    //this.model.noOfDays = leaveDetail.noOfDays;
    this.model.leaveReason = leaveDetail.leaveDetail;
    this.model.leaveStatus= status;
    this.model.updatedBy= this.auth.userId();
    this.leaveMgmtService.approveStaffLeave(this.model)
    .subscribe(
        data => {
            if (!data.error) {
                this.getStaffApproveLeaves();
                this.model = {};
                this.message = '';
            } else {
                this.message = data.error;
                this.loading = false;
            }
        },
        error => {
            const errorData = this.auth.handleResponse(error);
            if (errorData) {
                this.message = 'Something went wrong, Please try again later' ;
                this.loading = false;
            } 
        });
      
  }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages && (this.leaves.length < 0 )) {
        return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.leaves.length, page);
    // get current page of items
    this.pagedItems = this.leaves.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

}


