import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONFIG } from './../../../app.constant';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoginUserService, TimelineMgmtService, SchoolMgmtService, StudentMgmtService } from '../../../helpers/services/service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Util } from '../../../helpers/util';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    @Input() mode: string;
    @Input() student:any;
    @ViewChild('settings') modalRef: ElementRef;    
    @Output() settings: EventEmitter<any> = new EventEmitter();
    
    model: any = {};
    loading = false;
    modalReference: any;
    closeResult: string;
    settingsModalRef: any;
    userRole: string;
    obj: any = {};
    message: string;

    ngAfterViewInit() {
        // this.composeModalRef=
        // console.log(this.modalRef);
    }
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private auth: LoginUserService,
        private studentService: StudentMgmtService,
        private timelineService: TimelineMgmtService,
        private _fb: FormBuilder,
        public toastr: ToastsManager, vcr: ViewContainerRef,
        public util: Util
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    open(content, student) {
        this.model=student;
        this.modalReference = this.modalService.open(this.modalRef, { size: 'lg' });
        this.modalReference.result.then((result) => {
            this.resetModelAndMessage();
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    ngOnInit() {
        
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

    saveSettings(content) {
        this.message = '';
        this.obj={};
        this.obj.studentID=this.model.studentID;
        this.obj.totalFee=this.model.totalFee;
        this.studentService.saveSettings(this.obj)
        .subscribe(
            data => {
                if (!data.error) {
                    this.toastr.success('Settings saved successfully');
                    this.modalReference.dismiss('Manually');
                    this.settings.emit('Settings saved successfully');
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
