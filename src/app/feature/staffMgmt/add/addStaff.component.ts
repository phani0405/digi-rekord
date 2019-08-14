import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONFIG } from './../../../app.constant';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { StaffMgmtService, AlertService, LoginUserService, SchoolMgmtService } from '../../../helpers/services/service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Upload } from '../../../helpers/models/upload-file.models';
import { UploadService } from '../../../helpers/services/upload-file.service';
import { Util } from '../../../helpers/util';

@Component({
    selector: 'app-add-staff',
    templateUrl: './addStaff.component.html',
    styleUrls: ['./addStaff.component.scss'],
    providers: [AlertService],
})
export class AddStaffComponent implements OnInit {
    @Input() mode: string;
    @Input() teaching: string;
    @Output() add: EventEmitter<any> = new EventEmitter();
    model: any = {
        gender: '',
        staffRole: null,
    };
    loading = false;
    modalReference: any;
    closeResult: string;
    message: string;
    roles: any;
    userExists: boolean;
    selectedFiles: FileList | null;
    currentUpload: Upload;
    disableAddAttachmentButton: boolean = false;

    genders = [
        { value: 'Male', display: 'Male' },
        { value: 'Female', display: 'Female' },
    ];
    public attachmentForms: FormGroup;
    states: any[];
    currentUploadPhoto: Upload;
    uploadingImageLoading: any;
    selectedImage: any = [];

    ngOnInit() {
        this.model.gender = this.genders[0].value;
        this.initAttachments();
        this.getStaffRoles();
        this.getStateAndDistricts();
    }
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private staffService: StaffMgmtService,
        private alertService: AlertService,
        private auth: LoginUserService,
        private _fb: FormBuilder,
        private schoolService: SchoolMgmtService,
        public toastr: ToastsManager, vcr: ViewContainerRef,
        private upSvc: UploadService,
        public util: Util,
    ) {
        this.toastr.setRootViewContainerRef(vcr);
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

    initAttachments() {
        this.attachmentForms = this._fb.group({
            itemRows: this._fb.array([]),
        });
    }

    checkUserId(enteredValue : string ) {  
        console.log(enteredValue);
        this.staffService.checkUserExists(enteredValue)
        .subscribe(
        data => {
            if (data) {
                this.userExists = data.userExists;
            } else {
            }
        });
    }

    /*
   This creates a new formgroup. You can think of it as adding an empty object
   into an array. So we are pushing an object to the formarray 'itemrows' that
   has the property 'itemname'.
   */
    initItemRows() {
        return this._fb.group({
            fileName: [''],
            fileUrl: [''],
            mimeType: [''],
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

    open(content) {
        this.modalReference = this.modalService.open(content, { size: 'lg' });
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
            return `with: ${reason}`;
        }
    }

    getStaffRoles() {
        this.staffService.getStaffRoles()
            .subscribe(
            data => {
                if (data) {
                    this.roles = data.staffRoles;
                } else {
                }
            });

    }

    addStaff(content) {
        const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
        this.mergeAttachments();
        if (this.attachmentForms.value && this.attachmentForms.value.itemRows && this.attachmentForms.value.itemRows.length > 0) {
            this.model.attachments = this.selectedImage;
        }
        this.staffService.createStaff(this.model, schoolId, this.teaching)
            .subscribe(
            data => {
                if (!data.error) {
                    this.modalReference.dismiss('Manually');
                    this.toastr.success('Staff added successfully');
                    this.add.emit('Staff added successfully');
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

    detectFiles($event: Event) {
        this.selectedFiles = ($event.target as HTMLInputElement).files;
    }

    readUrl(event: any) {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            const file = event.target.files;
            if (CONFIG.LOGO_FILE_TYPE.indexOf(file[0].type) === -1) {
                this.toastr.error(CONFIG.MSG.invalid_logo_file_type);
                return;
            }
            if (file[0].size >= CONFIG.LOGO_MAX_SIZE) {
                this.toastr.error(CONFIG.MSG.invalid_logo_file_size);
                return;
            }
            if (file && file.length === 1) {
                this.currentUploadPhoto = new Upload(file.item(0));
                this.uploadingImageLoading = true;
                this.upSvc.pushUpload(this.currentUploadPhoto).then(
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
}
