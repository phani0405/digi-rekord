import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONFIG } from './../../../app.constant';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoginUserService, TimelineMgmtService, SchoolMgmtService } from '../../../helpers/services/service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Upload } from '../../../helpers/models/upload-file.models';
import { UploadService } from '../../../helpers/services/upload-file.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Util } from '../../../helpers/util';

@Component({
    selector: 'app-compose',
    templateUrl: './compose.component.html',
    styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit {
    @Input() mode: string;
    @ViewChild('composeMsg') modalRef: ElementRef;    
    @Output() add: EventEmitter<any> = new EventEmitter();
    
    model: any = {
        messageType: null
    };
    loading = false;
    modalReference: any;
    closeResult: string;
    message: string;
    composeModalRef: any;
    messageTypes: any[] = [{ messageID: 1, messageType: "News/Circular" }, { messageID: 2, messageType: "Assignment/Diary" }];
    userRole: string;
    selectedFiles: FileList | null;
    currentUpload: Upload;
    disableAddAttachmentButton: boolean = false;
    public attachmentForms: FormGroup;
    selectedImage: any = [];
    obj: any = {};

    ngAfterViewInit() {
        // this.composeModalRef=
        // console.log(this.modalRef);
    }
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private auth: LoginUserService,
        private timelineService: TimelineMgmtService,
        private _fb: FormBuilder,
        private upSvc: UploadService,
        public toastr: ToastsManager, vcr: ViewContainerRef,
        public util: Util
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    open(content, student) {
        this.model.studentIDs = [student.studentRollNo];
        this.model.sendTo = 'students';
        this.modalReference = this.modalService.open(this.modalRef, { size: 'lg' });
        this.modalReference.result.then((result) => {
            this.resetModelAndMessage();
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

    }

    ngOnInit() {
        this.initAttachments()
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

    initAttachments() {
        this.attachmentForms = this._fb.group({
            itemRows: this._fb.array([]),
        });
    }

    initItemRows() {
        return this._fb.group({
            fileName: [''],
            fileUrl: [''],
            mimeType: ['']
        });
    }

    addNewRow() {
        const control = <FormArray>this.attachmentForms.controls['itemRows'];
        this.selectedImage.push({});
        control.push(this.initItemRows());
    }

    deleteRow(index: number) {
        const control = <FormArray>this.attachmentForms.controls['itemRows'];
        this.selectedImage.splice(index, 1);
        control.removeAt(index);
    }

    resetModelAndMessage() {
        this.model = {};
        this.message = '';
        this.selectedImage = [];
        this.initAttachments();
    }

    mergeAttachments() {
        const items = this.attachmentForms.value.itemRows;
        for (let i = 0; i < items.length; i++) {
            this.selectedImage[i].fileName = items[i].fileName;
        }
    }

    fileuploaderFileChange(event: any, index) {
        this.disableAddAttachmentButton = true;
        if (event.target.files && event.target.files[0]) {
            const files = event.target.files;
            this.selectedFiles = files;
            const file = this.selectedFiles;
            if (file && file.length === 1) {
                this.currentUpload = new Upload(file.item(0));
                let mimeType = this.util.getMimeType(this.currentUpload.file)
                this.model.isUploadInProgress = false;
                this.model.loading = true;
                this.model.selectedFileIndex = index;
                this.upSvc.pushUpload(this.currentUpload).then(
                    success => {
                        const upload: any = success;
                        this.attachmentForms.value.itemRows[index].fileUrl = upload.url;
                        this.attachmentForms.value.itemRows[index].mimeType = mimeType;
                        const at = Object.assign({}, this.attachmentForms.value.itemRows[index]);
                        this.disableAddAttachmentButton = false;
                        this.model.isUploadInProgress = true;
                        this.model.loading = false;
                        this.selectedImage[index] = at;
                        this.toastr.success('File uploaded successfully');
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

    composeMessage(content) {
        this.model.schoolID = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
        const instituteID = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
        this.mergeAttachments();
        if (this.attachmentForms.value && this.attachmentForms.value.itemRows && this.attachmentForms.value.itemRows.length > 0) {
            this.model.attachments = this.selectedImage;
        }
        //this.model.title= '';
        this.model.createdBy = this.auth.userId();
        this.model.createdRole = this.auth.userRole();
        this.timelineService.create(this.model)
            .subscribe(
            data => {
                if (!data.error) {
                    this.model = {};
                    this.message = '';                    
                    this.triggerSMS(data);
                    this.modalReference.dismiss('Manually');
                    this.add.emit('Message composed successfully');
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

    triggerSMS(data){
        this.obj={};
        this.obj.messageID=data.messageResponse.messageID;
        this.obj.mobileNos=data.mobileNos;
        this.timelineService.triggerSMS(this.obj)
            .subscribe(
            data => {
                if (!data.error) {
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
                    // this.modalReference.dismiss('Manually');
                }
            });
    }
}
