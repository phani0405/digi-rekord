import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoginUserService, CustomSMSMgmtService } from '../../../helpers/services/service';
import { Router } from '@angular/router';
import { CONFIG } from '../../../app.constant';
import { Util } from '../../../helpers/util';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as _ from 'underscore';
declare var jquery: any;
declare var $: any;
/**
 *
 */
@Component({
    selector: 'app-sms-list',
    templateUrl: './sms-list.component.html',
    styleUrls: ['./sms-list.component.scss'],
})
export class SMSListComponent implements OnInit {
    _router: Router;
    url: string;
    model: any = {
    };
    modalReference: any;
    closeResult: string;
    loading = false;
    message: string;
    posts: any[];
    childrenUpdateEvent: any;
    smslist: any = [];
    rowBatchSize = 3;
    deleteModelReference: any;
    userId: string;
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private auth: LoginUserService,
        private customSMSMgmtService: CustomSMSMgmtService,
        public util: Util,
        public toastr: ToastsManager,
        vcr: ViewContainerRef,
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.getSMSList();
        this.userId=this.auth.userId();
    }

    getSchoolID() {
            return this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    }

    getSMSList() {
        const schoolId = this.getSchoolID();
        this.customSMSMgmtService.getSMS({ schoolID: schoolId })
        .subscribe(
        smslist => {
            if (smslist && smslist.length>0) {
                this.smslist=smslist;
            }
        },
        error => {
            
        });
    }
}



