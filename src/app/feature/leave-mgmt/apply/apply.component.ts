

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONFIG } from './../../../app.constant';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {LoginUserService , StaffMgmtService, LeaveMgmtService} from '../../../helpers/services/service';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss'],
})
export class ApplyComponent implements OnInit {
    model: any = {
    };
    loading = false;
    modalReference: any;
    closeResult: string;
    message: string;
    staffs: any;
    isApplyAllowed: boolean;
    @Input() leaveApplyAllowd: boolean;
    @Output() add: EventEmitter<any> = new EventEmitter();
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private auth: LoginUserService,
        private staffMgmtService: StaffMgmtService,
        private leaveMgmtService: LeaveMgmtService,
    ) { }

    ngOnInit() {
        this.isApplyAllowed = this.leaveApplyAllowd;
        // this.isApplyAllowed = (this.auth.userRole().toLocaleLowerCase() === 'parent' || this.auth.userRole().toLocaleLowerCase() === 'teachingstaff') ? true : false;
    }

    open(content) {
        this.modalReference = this.modalService.open(content, {size : 'lg'});
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
            return  `with: ${reason}`;
        }
    }

    resetModelAndMessage() {
        this.model = {};
        this.message = '';
    }

    applyLeave(content) {
        var userRole = this.auth.userRole();
        this.model.fromDate = this.auth.formateDateIntoString(this.model.fromDate)
        this.model.toDate = this.auth.formateDateIntoString(this.model.toDate)
        if(userRole === 'parent'){
            const sChild = this.auth.getSelectedChildren()
            this.model.schoolID = sChild && sChild.schoolID ? sChild.schoolID : '';
            this.model.studentID = sChild && sChild.studentID ? sChild.studentID  : '';
            this.model.studentName = sChild && sChild.studentName ? sChild.studentName : '';
            this.model.parentID = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].parentID : '';
            this.model.parentName = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].parentName : '';
            this.model.createdBy= this.auth.userId();
            this.model.classID= sChild && sChild.classID ? sChild.classID : '';
            this.model.studentRollNo= sChild && sChild.studentRollNo ? sChild.studentRollNo : '';

            this.leaveMgmtService.applyLeave(this.model)
                .subscribe(
                data => {

                    if (!data.error) {
                        this.modalReference.dismiss('Manually');
                        this.add.emit('Leave submitted successfully');
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
                    } else {
                        this.modalReference.dismiss('Manually');
                    }
                });
        }else{
            this.model.schoolID = this.auth.registeredDetails()[0].schoolID ? this.auth.registeredDetails()[0].schoolID : '';
            this.model.staffID = this.auth.registeredDetails()[0].staffID ? this.auth.registeredDetails()[0].staffID : '';
            this.model.staffName = this.auth.registeredDetails()[0].staffName ? this.auth.registeredDetails()[0].staffName : '';
            this.model.userID= this.auth.userId();
            this.model.createdBy= this.auth.userId();
            this.leaveMgmtService.applyStaffLeave(this.model)
                .subscribe(
                data => {

                    if (!data.error) {
                        this.modalReference.dismiss('Manually');
                        this.add.emit('Leave submitted successfully');
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
                    } else {
                        this.modalReference.dismiss('Manually');
                    }
                });
        }
    
        // this.model.noOfDays= 2;
    
        // this.leaveMgmtService.applyLeave(this.model)
        // .subscribe(
        // data => {

        //     if (!data.error) {
        //         this.model = {};
        //         this.message = '';
        //         this.modalReference.dismiss('Manually');
        //         this.add.emit('Leave submitted successfully');
        //     } else {
        //         this.message = data.error;
        //         this.loading = false;
        //     }
        // },
        // error => {
        //     const errorData = this.auth.handleResponse(error);
        //     if (errorData) {
        //         this.message = 'Something went wrong, Please try again later' ;
        //         this.loading = false;
        //     } else {
        //         this.modalReference.dismiss('Manually');
        //     }
        // });
      
    }

    getAllStaffs() {
        const schoolId = this.auth.getSelectedChildren() && this.auth.getSelectedChildren().schoolID ? this.auth.getSelectedChildren().schoolID : this.auth.registeredDetails()[0].schoolID;
        this.staffMgmtService.getStaff(this.auth.userId(), schoolId)
        .subscribe(
            staffs => {
                if (staffs) {
                    this.staffs = staffs;
                } else {
                }
            },
        );
    }
}
