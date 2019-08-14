import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONFIG } from './../../../app.constant';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GalleryMgmtService, AlertService, LoginUserService } from '../../../helpers/services/service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Upload } from '../../../helpers/models/upload-file.models';
import { UploadService } from '../../../helpers/services/upload-file.service';
import { Util } from '../../../helpers/util';

@Component({
    selector: 'app-create-gallery',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})

export class CreateGalleryComponent implements OnInit {
    @Input() mode: string;
    @Output() add: EventEmitter<any> = new EventEmitter();
    model: any = {
        isUploadInProgress: true,
    };
    loading = false;
    modalReference: any;
    closeResult: string;
    message: string;
    roles: any;
    selectedFiles: FileList | null;
    currentUpload: Upload;
    disableAddAttachmentButton = false;
    selectedImage: any = [];
    public attachmentForms: FormGroup;

    ngOnInit() {
        this.initAttachments();
    }

    constructor(
        private router: Router,
        private modalService: NgbModal,
        private galleryMgmtService: GalleryMgmtService,
        private alertService: AlertService,
        private auth: LoginUserService,
        private _fb: FormBuilder,
        public toastr: ToastsManager, vcr: ViewContainerRef,
        private upSvc: UploadService,
        public util: Util,
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    initAttachments() {
        this.attachmentForms = this._fb.group({
            itemRows: this._fb.array([]),
        });
    }

    /*
   This creates a new formgroup. You can think of it as adding an empty object
   into an array. So we are pushing an object to the formarray 'itemrows' that
   has the property 'itemname'.
   */
    initItemRows() {
        return this._fb.group({
            fileName: ['', [Validators.required]],
            fileUrl: [''],
            // mimeType: [''],
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
                        // this.attachmentForms.value.itemRows[index].mimeType = mimeType;
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

    openImageModel(content) {
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

    getRequestObj() {
        const req = JSON.parse(JSON.stringify(this.selectedImage));
        req.map((i) => {
            i.imageName = i.fileName;
            i.imageUrl = i.fileUrl;
            i.albumName = 'gallery';
            i.schoolID = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
            i.instituteID = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
            i.createdBy = this.auth.userId();
            delete i['fileName'];
            delete i['fileUrl'];
            return i;
        });
        return req;
    }

    addImage(imageModel) {
        const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
        this.mergeAttachments();
        if (this.attachmentForms.value && this.attachmentForms.value.itemRows && this.attachmentForms.value.itemRows.length > 0) {
            this.model.attachments = this.selectedImage;
        }
        const req = this.getRequestObj();
        this.galleryMgmtService.createGallery(req)
            .subscribe(
            data => {
                if (!data.error) {
                    this.modalReference.dismiss('Manually');
                    this.toastr.success('Images added successfully');
                    this.add.emit('Images added successfully');
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
