import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONFIG } from './../../../app.constant';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { InstituteService, AlertService, LoginUserService, SchoolMgmtService } from '../../../helpers/services/service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Upload } from '../../../helpers/models/upload-file.models';
import { UploadService } from '../../../helpers/services/upload-file.service';
// import { CustomValidators } from '../../../helpers/validators/custom.validators.service';

@Component({
    moduleId: module.id,
    selector: 'app-add-institute',
    templateUrl: './addInstitute.component.html',
    styleUrls: ['./addInstitute.component.scss'],
    providers: [AlertService],
})
export class AddInstituteComponent implements OnInit {
    @Input() mode: string;
    @Output() add: EventEmitter<any> = new EventEmitter();
    model: any = {};
    loading = false;
    modalReference: any;
    closeResult: string;
    message: string;
    currentUpload: Upload;
    states: any;
    uploadingImageLoading: any
    allFeatures: any
    timeZones: any

    onlyNumberKey(event) {
        return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
    }
    onlyAlphabetKey(event) {
        return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123);
    }
    ngOnInit() {
        this.getStateAndDistricts();
        this.getAllFeatures();
        this.getTimeZones();
    }
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private instituteService: InstituteService,
        private alertService: AlertService,
        private auth: LoginUserService,
        private upSvc: UploadService,
        private schoolMgmt: SchoolMgmtService,
        public toastr: ToastsManager, vcr: ViewContainerRef
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    getStateAndDistricts() {
        this.schoolMgmt.getDistricts().subscribe(
            data => {
                if (data.districts) {
                    this.states = data.districts;
                } else {
                    console.log("Data error");
                }
            },
        );
    }

    getAllFeatures() {
        this.schoolMgmt.getAllFeatures().subscribe(
            data => {
                if (data.features) {
                    this.allFeatures = data.features;
                } else {
                    console.log("Data error");
                }
            },
        );
    }

    getTimeZones() {
        this.schoolMgmt.getTimeZones().subscribe(
            data => {
                if (data.timeZones) {
                    this.timeZones = data.timeZones;
                } else {
                    console.log("Data error");
                }
            },
        );
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

    resetModelAndMessage() {
        this.model = {};
        this.message = '';
    }

    addInstitute(content) {
        this.model.features=this.allFeatures;
        this.instituteService.createInstitute(this.model, this.model.url)
            .subscribe(
            data => {
                if (!data.error) {
                    this.modalReference.dismiss('Manually');
                    this.add.emit('Institute added successfully');
                } else {
                    this.message = data.error;
                    this.loading = false;
                }
            },
            error => {
                // this.alertService.error('Something went wrong, Please try again later');
                const errorData = this.auth.handleResponse(error);
                if (errorData) {
                    this.message = 'Something went wrong, Please try again later';
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
            if (CONFIG.LOGO_FILE_TYPE.indexOf(file[0].type) === -1) {
                this.toastr.error(CONFIG.MSG.invalid_logo_file_type);
                return;
            }
            if (file[0].size >= CONFIG.LOGO_MAX_SIZE) {
                this.toastr.error(CONFIG.MSG.invalid_logo_file_size);
                return;
            }
            if (file && file.length === 1) {
                this.uploadingImageLoading = true;
                this.currentUpload = new Upload(file.item(0));
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
}
