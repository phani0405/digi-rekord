import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PagerService } from '../../../helpers/services/pagination.service';
import { StaffMgmtService, AlertService, LoginUserService, SchoolMgmtService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import * as _ from 'underscore';
import { Institute } from '../../../helpers/models/institute';
import { InstituteService } from '../../../helpers/services/service';
import { SearchFilterPipe } from '../../../helpers/filters/filter';
import { Upload } from '../../../helpers/models/upload-file.models';
import { UploadService } from '../../../helpers/services/upload-file.service';
import { Util } from '../../../helpers/util';

@Component({
    selector: 'app-staff-list',
    templateUrl: './staff-list.component.html',
    styleUrls: ['./staff-list.component.scss'],
    // styles: ['.custom {color : blue}'],
})
export class StaffListComponent implements OnInit {
    @Input() teaching: string;
    _router: Router;
    listFilter = '';
    staffs: any;
    staffDetail: any;
    selectedStaffDetail: any;
    pager: any = {};
    pagedItems: any[];
    modalReference: any;
    closeResult: string;
    url: string;
    model: any = {
        searchText: '',
    };
    loading = false;
    message: string;
    genders = [
        { value: 'Male', display: 'Male' },
        { value: 'Female', display: 'Female' },
    ];
    public attachmentForms: FormGroup;
    selectedFiles: FileList | null;
    currentUpload: Upload;
    disableAddAttachmentButton: boolean = false;
    roles: any;
    states: any[];
    currentUploadPhoto: Upload;
    uploadingImageLoading: any;
    deleteModelReference: any;
    selectedImage: any = [];
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private staffMgmtService: StaffMgmtService,
        private alertService: AlertService,
        private pagerService: PagerService,
        private institute: Institute,
        private auth: LoginUserService,
        private schoolService: SchoolMgmtService,
        private _fb: FormBuilder,
        public toastr: ToastsManager, vcr: ViewContainerRef,
        private upSvc: UploadService,
        public util: Util,
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.getStaffRoles();
        this.getAllStaffs();
        this.getSchoolClassDetails();
        this.initAttachments();
        this.getStateAndDistricts();
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

    getStaffRoles() {
        this.staffMgmtService.getStaffRoles()
            .subscribe(
            data => {
                if (data) {
                    this.roles = data.staffRoles;
                } else {
                }
            });

    }

    getAllStaffs() {
        const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
        this.staffMgmtService.getStaff(this.auth.userId(), schoolId, this.teaching)
            .subscribe(
            staffs => {
                if (staffs) {
                    this.staffs = staffs.sort(function (a, b) {
                        return (a.createdDate < b.createdDate) ? 1 : ((b.createdDate < a.createdDate) ? -1 : 0);
                    });
                    this.setPage(1);
                } else {
                }
            },
        );
    }

    getSchoolClassDetails() {
        const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
        this.schoolService.getSchoolDetail(schoolId)
            .subscribe(
            schoolDetail => {
                if (schoolDetail) {
                    this.auth.schoolDetail = schoolDetail;
                } else {
                }
            },
            error => {
            },
        );
    }

    openModelWithDetail(content, staffDetail) {
        this.selectedStaffDetail = staffDetail;
        this.modalService.open(content, { size: 'lg' });
    }

    openDeleteModel(content, staffDetail) {
        this.selectedStaffDetail = staffDetail;
        this.deleteModelReference = this.modalService.open(content, { size: 'lg' });
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages && (this.staffs.length < 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.staffs.length, page);
        // get current page of items
        this.pagedItems = this.staffs.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    open(content, selectedModel) {
        this.model = this.getModelObject(selectedModel);
        if (selectedModel.attachments && selectedModel.attachments.length > 0) {
            selectedModel.attachments.forEach((at) => {
                this.addNewRow(at.fileName, at.fileUrl, at.mimeType, at.fileID);
            });
        }
        this.modalReference = this.modalService.open(content, { size: 'lg' });
        this.modalReference.result.then((result) => {
            this.attachmentForms = this._fb.group({
                itemRows: this._fb.array([]),
            });
            this.resetModelAndMessage();
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.attachmentForms = this._fb.group({
                itemRows: this._fb.array([]),
            });
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    getGenderValue(selectedGender) {
        const genderValue = this.genders.filter((gender) => gender.value === selectedGender);
        return genderValue && genderValue.length > 0 ? genderValue[0].value : 'Male';
    }

    getModelObject(selectedModel) {
        return {
            id: selectedModel.id,
            schoolID: selectedModel.schoolID,
            staffID: selectedModel.staffID,
            staffCode: selectedModel.staffCode,
            userID: selectedModel.userID,
            userName: selectedModel.staffName,
            url: selectedModel.photo,
            gender: this.getGenderValue(selectedModel.gender),
            qualification: selectedModel.qualification,
            yearOfPassing: selectedModel.yearOfPassing,
            staffRole: selectedModel.staffRole,
            email: selectedModel.staffEmailID,
            mobile: selectedModel.staffMobile,
            teaching: selectedModel.teaching,
            staffAddress: selectedModel.staffAddress ? selectedModel.staffAddress.address : '',
            staffCity: selectedModel.staffAddress ? selectedModel.staffAddress.city : '',
            staffDistrict: selectedModel.staffAddress ? selectedModel.staffAddress.district : '',
            staffState: selectedModel.staffAddress ? selectedModel.staffAddress.state : '',
            staffPinCode: selectedModel.staffAddress ? selectedModel.staffAddress.pincode : '',
        };
    }

    private getDismissReason(reason: any): string {
        this.resetModelAndMessage();
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdp';
        } else {
            return `with: ${reason}`;
        }
    }

    resetModelAndMessage() {
        this.model = {};
        this.message = ''; this.selectedImage = [];
        this.initAttachments();
    }

    mergeAttachments() {
        const items = this.attachmentForms.value.itemRows;
        for (let i = 0; i < items.length; i++) {
            this.selectedImage[i].fileName = items[i].fileName;
        }
    }

    updateStaff(content) {
        this.mergeAttachments();
        if (this.attachmentForms.value && this.attachmentForms.value.itemRows && this.attachmentForms.value.itemRows.length > 0) {
            this.model.attachments = this.selectedImage;
        }
        this.staffMgmtService.updateStaff(this.model)
            .subscribe(
            data => {
                if (!data.error) {
                    this.modalReference.dismiss('Manually');
                    this.toastr.success('Staff updated successfully');
                    this.getAllStaffs();
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
    initItemRows(fileName?: string, fileUrl?: string, mimeType?: string, fileID?: string) {
        return this._fb.group({
            fileName: [fileName ? fileName : ''],
            fileUrl: [fileUrl ? fileUrl : ''],
            mimeType: [mimeType ? mimeType : ''],
            fileID: [fileID? fileID: '']
        });
    }

    getSelectedImage(fileName?: string, fileUrl?: string, mimeType?: string, fileID?: string) {
        return {
            fileName: fileName,
            fileUrl: fileUrl,
            mimeType: mimeType,
            fileID: fileID
        }
    }

    addNewRow(fileName?: string, fileUrl?: string, mimeType?: string, fileID?: string) {
        const control = <FormArray>this.attachmentForms.controls['itemRows'];
        this.selectedImage.push(this.getSelectedImage(fileName, fileUrl, mimeType, fileID));
        control.push(this.initItemRows(fileName, fileUrl, mimeType, fileID));
    }

    deleteRow(index: number) {
        const control = <FormArray>this.attachmentForms.controls['itemRows'];
        this.selectedImage.splice(index, 1);
        control.removeAt(index);
    }

    deleteAttachment(index: number, fileID: string) {

        if(fileID) {
            const fileIDs = [fileID]
            this.staffMgmtService.deleteStaffAttachment(this.model.staffID, fileIDs)
                .subscribe(
                    data => {
                        if (!data.error) {
                            this.toastr.success('Attachment deleted successfully');
                            this.deleteRow(index)
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
        } else {
            this.deleteRow(index)
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
                    }
                )
            } else {
                this.disableAddAttachmentButton = false;
                this.toastr.error('Unable to upload, Please try again later...');
            }
        }
    }

    deleteStaff(staff) {
        const data = {
            staffID: staff.staffID,
            updatedBy: this.auth.userId(),
        };
        this.staffMgmtService.deleteStaff(data)
            .subscribe(
            response => {
                if (!response.error) {
                    this.toastr.success('Staff deleted successfully');
                    // refresh the list
                    this.deleteModelReference.dismiss('Manually');
                    this.getAllStaffs();
                } else {
                    this.toastr.error(response.error);
                }
            },
            error => {
                this.toastr.error('Unable to delete staff, Please try again later...');
            },
        );
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
