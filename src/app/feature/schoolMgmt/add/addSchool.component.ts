import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONFIG } from './../../../app.constant';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { SchoolMgmtService, AlertService, LoginUserService } from '../../../helpers/services/service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Upload } from '../../../helpers/models/upload-file.models';
import { UploadService } from '../../../helpers/services/upload-file.service';
// import { CustomValidators } from '../../../helpers/validators/custom.validators.service';

@Component({
    moduleId: module.id,
    selector: 'app-add-school',
    templateUrl: './addSchool.component.html',
    styleUrls: ['./addSchool.component.scss'],
    providers: [AlertService],
})
export class AddSchoolComponent implements OnInit {
    @Input() mode: string;
    @Output() add: EventEmitter<any> = new EventEmitter();
    model: any = {
        url : undefined
    };
    loading = false;
    modalReference: any;
    closeResult: string;
    message: string;
    currentUpload: Upload;
    states: any[];
    uploadingImageLoading: any;

    onlyNumberKey(event) {
        return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
    }
    onlyAlphabetKey(event) {
        return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123);
    }
    ngOnInit() {
        this.getStateAndDistricts();
    }

    constructor(
        private router: Router,
        private modalService: NgbModal,
        private schoolService: SchoolMgmtService,
        private alertService: AlertService,
        private auth: LoginUserService,
        private upSvc: UploadService,
        public toastr: ToastsManager, vcr: ViewContainerRef,
    ) { 
        this.toastr.setRootViewContainerRef(vcr);
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

    getStateAndDistricts() {
        this.schoolService.getDistricts().subscribe(
            data => {
                if (data.districts) {
                    this.states = data.districts;
                } else {
                    console.log("Data error");
                }
            },
        );
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

    addSchool(content) {
        this.model.openTime = this.getSchoolOpenCloseTime(this.model.openTime);
        this.model.closeTime = this.getSchoolOpenCloseTime(this.model.closeTime);
        this.schoolService.createSchool(this.model, this.model.url)
        .subscribe(
            data => {
                if (!data.error) {
                    this.modalReference.dismiss('Manually');
                    this.toastr.success('School added successfully');
                    this.add.emit('School created successfully');
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

    readUrl(event: any) {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            const file = event.target.files;
            if(CONFIG.LOGO_FILE_TYPE.indexOf(file[0].type) === -1) {
                this.toastr.error(CONFIG.MSG.invalid_logo_file_type);
                return;
            }
            if(file[0].size >= CONFIG.LOGO_MAX_SIZE) {
                this.toastr.error(CONFIG.MSG.invalid_logo_file_size);
                return;
            }
            if (file && file.length === 1) {
                this.currentUpload = new Upload(file.item(0));
                this.uploadingImageLoading = true; 
                this.upSvc.pushUpload(this.currentUpload).then(
                    success => {
                        this.uploadingImageLoading = false; 
                        const upload: any = success;
                        this.model.url = upload.url;
                        reader.readAsDataURL(event.target.files[0]);
                        this.toastr.success('File uploaded successfully');
                    },
                    error => {
                        this.uploadingImageLoading = false; 
                        this.toastr.error('Unable to upload, Please try again later...');
                    },
                );
            } else {
                this.uploadingImageLoading = false; 
                this.toastr.error('Unable to upload, Please try again later...');
            }
        }
    }
    
    getSchoolOpenCloseTime(time) {
        if (time) {
            const ct = new Date();
            const newDate = new Date(ct.getFullYear(), ct.getMonth(), ct.getDate(), time.hour, time.minute);
            return newDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        } else {
            return ;
        }
    }

    resetModelAndMessage() {
        this.model = {};
        this.message = '';
    }
}
