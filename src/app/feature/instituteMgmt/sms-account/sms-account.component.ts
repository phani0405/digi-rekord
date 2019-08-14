import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONFIG } from './../../../app.constant';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoginUserService, TimelineMgmtService, SchoolMgmtService, InstituteService } from '../../../helpers/services/service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Util } from '../../../helpers/util';

@Component({
    selector: 'app-sms-account',
    templateUrl: './sms-account.component.html',
    styleUrls: ['./sms-account.component.scss']
})
export class SMSAccountComponent implements OnInit {
    @Input() mode: string;
    @Input() institute:any;
    @ViewChild('smsaccount') modalRef: ElementRef;    
    @Output() smsaccount: EventEmitter<any> = new EventEmitter();
    
    model: any = {};
    loading = false;
    modalReference: any;
    closeResult: string;
    settingsModalRef: any;
    userRole: string;
    obj: any = {};
    message: string;
    trans: Boolean = false;

    ngAfterViewInit() {
        // this.composeModalRef=
        // console.log(this.modalRef);
    }
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private auth: LoginUserService,
        private instituteService: InstituteService,
        private timelineService: TimelineMgmtService,
        private _fb: FormBuilder,
        public toastr: ToastsManager, vcr: ViewContainerRef,
        public util: Util
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    open(content, institute) {
        if(institute && institute.smsAccountDetails)
            this.model=institute.smsAccountDetails;
        else
            this.model={};
        this.modalReference = this.modalService.open(this.modalRef, { size: 'lg' });
        this.modalReference.result.then((result) => {
            this.resetModelAndMessage();
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    ngOnInit() {
        this.trans=false;
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
        this.model = {};
    }

    saveSMSAccountDetails(content) {
        this.message = '';
        this.obj={};
        this.obj.instituteID=this.institute.instituteID;
        this.obj.smsAccountDetails={};
        this.obj.smsAccountDetails.url=this.model.url;
        this.obj.smsAccountDetails.userName=this.model.userName;
        this.obj.smsAccountDetails.password=this.model.password;
        this.obj.smsAccountDetails.apiKey=this.model.apiKey;
        this.obj.smsAccountDetails.senderID=this.model.senderID;
        this.instituteService.saveSMSAccountDetails(this.obj)
        .subscribe(
            data => {
                if (!data.error) {
                    this.toastr.success('Settings saved successfully');
                    this.modalReference.dismiss('Manually');
                    this.smsaccount.emit('Settings saved successfully');
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
}
