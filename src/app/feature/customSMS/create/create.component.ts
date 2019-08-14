import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONFIG } from './../../../app.constant';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CustomSMSMgmtService, AlertService, LoginUserService } from '../../../helpers/services/service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Upload } from '../../../helpers/models/upload-file.models';
import { UploadService } from '../../../helpers/services/upload-file.service';
import { Util } from '../../../helpers/util';

@Component({
    selector: 'app-create-sms',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})

export class CreateSMSComponent implements OnInit {
    @Input() mode: string;
    @Output() add: EventEmitter<any> = new EventEmitter();
    model: any = {
        isUploadInProgress: true,
    };
    loading = false;
    modalReference: any;
    closeResult: string;
    message: string;
    fileUrl: string;
    roles: any;
    selectedFiles: FileList | null;
    currentUpload: Upload;
    disableAddAttachmentButton = false;
    selectedImage: any = [];
    excelAttributes: any =[];
    request: any;
    uploadedFile: String;
    previewSMS: any =[];
    public attachmentForms: FormGroup;

    ngOnInit() {
    }

    constructor(
        private router: Router,
        private modalService: NgbModal,
        private customSMSMgmtService: CustomSMSMgmtService,
        private alertService: AlertService,
        private auth: LoginUserService,
        private _fb: FormBuilder,
        public toastr: ToastsManager, vcr: ViewContainerRef,
        private upSvc: UploadService,
        public util: Util,
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    onNavigate(){
        window.open("https://firebasestorage.googleapis.com/v0/b/digirekord-fa7a2.appspot.com/o/uploads%2Fbulksms%20(2).xlsx?alt=media&token=4fd95033-b68d-4fec-9cd8-5641959e7825", "_blank");
    }

    fileuploaderFileChange(event: any, index) {
        this.disableAddAttachmentButton = true;
        if (event.target.files && event.target.files[0]) {
            const files = event.target.files;
            this.selectedFiles = files;
            const file = this.selectedFiles;
            if (file && file.length === 1) {
                this.currentUpload = new Upload(file.item(0));
                const mimeType = this.util.getMimeType(this.currentUpload.file);
                this.model.isUploadInProgress = false;
                this.model.loading = true;
                this.upSvc.pushUpload(this.currentUpload).then(
                    success => {
                        const upload: any = success;
                        this.fileUrl = upload.url;
                        // this.attachmentForms.value.itemRows[index].mimeType = mimeType;
                        this.disableAddAttachmentButton = false;
                        this.model.isUploadInProgress = true;
                        this.model.loading = false;
                        this.toastr.success('File uploaded successfully');
                        this.getExcelAttributes();
                    },
                    error => {
                        this.model.loading = false;
                        this.disableAddAttachmentButton = false;
                        this.toastr.error('Unable to upload, Please try again later...');
                    },
                );
            } else {
                this.disableAddAttachmentButton = false;
                this.toastr.error('Unable to upload, Please try again later...');
            }
        }
    }

    openSMSModel(content) {
        this.model.smsContent="";
        this.fileUrl=null;
        this.excelAttributes=[];
        this.previewSMS=[];
        this.modalReference = this.modalService.open(content, { size: 'lg' });
        this.modalReference.result.then((result) => {
            this.resetModelAndMessage();
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.resetModelAndMessage();
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
            return `with: ${reason}`;
        }
    }

    resetModelAndMessage() {
        this.model = {};
        this.message = '';
        this.selectedImage = [];
        this.fileUrl=null;
    }

    getExcelAttributes() {
        this.request={};
        this.request.fileUrl=this.fileUrl;
        this.customSMSMgmtService.getExcelAttributes(this.request)
            .subscribe(
            data => {
                if (data && data.excelAttributes){
                    this.excelAttributes=data.excelAttributes;
                    this.uploadedFile=data.uploadedFile;
                }
            },
            error => {
                const errorData = this.auth.handleResponse(error);
                if (errorData) {
                    this.message = error.error.error;
                    this.loading = false;
                } else {
                    this.modalReference.dismiss('Manually');
                }
            });
    }

    onSelectMobile(event) {
        this.model.mobileNo = event;
    }

    appendData(item){
        this.model.smsContent=this.model.smsContent +'{'+item+'}';
    }

    getPreviewSMS(imageModel) {
        // const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
        // if (this.attachmentForms.value && this.attachmentForms.value.itemRows && this.attachmentForms.value.itemRows.length > 0) {
        //     this.model.attachments = this.selectedImage;
        // }
        this.request={};
        this.request.excelAttributes=this.excelAttributes;
        this.request.uploadedFile=this.uploadedFile;
        this.request.data=this.model;
        this.customSMSMgmtService.getPreviewSMS(this.request)
            .subscribe(
            data => {
                if (data && data.jsonData.length>0){
                    this.previewSMS=data.jsonData;
                }
            },
            error => {
                const errorData = this.auth.handleResponse(error);
                if (errorData) {
                    this.message = 'Something went wrong, Please try again later';
                    this.loading = false;
                } else {
                    this.modalReference.dismiss('Manually');
                }
            });
    }

    sendSMS(imageModel) {
        this.request={};
        this.request.schoolID = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
        this.request.instituteID = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
        this.request.createdBy = this.auth.userId();
        this.request.title=this.model.smsTitle;
        this.request.content=this.model.smsContent;
        this.request.fileUrl=this.fileUrl;
        this.request.sentTo=this.previewSMS;
        this.customSMSMgmtService.sendSMS(this.request)
        .subscribe(
        data => {
            if (!data.error) {
                this.modalReference.dismiss('Manually');
                this.toastr.success('SMS sent successfully');
                this.add.emit('SMS sent successfully');
            } else {
                this.message = data.error;
                this.loading = false;
            }
        },
        error => {
            const errorData = this.auth.handleResponse(error);
            if (errorData) {
                this.message = 'Something went wrong, Please try again later';
                this.loading = false;
            } else {
                this.modalReference.dismiss('Manually');
            }
        });
    }
}
