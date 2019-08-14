import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { iInstitute } from '../../../helpers/interfaces/iinstitute';
import { PagerService } from '../../../helpers/services/pagination.service';
import { InstituteService, AlertService, LoginUserService, SchoolMgmtService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import * as _ from 'underscore';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Upload } from '../../../helpers/models/upload-file.models';
import { UploadService } from '../../../helpers/services/upload-file.service';
import { Util } from '../../../helpers/util';
// import { CustomValidators } from '../../../helpers/validators/custom.validators.service';

@Component({
    selector: 'app-institute-list',
    templateUrl: './institute-list.component.html',
    styleUrls: ['./institute-list.component.scss'],
    // styles: ['.custom {color : blue}'],
    // providers: [InstituteService]
})
export class InstituteListComponent implements OnInit {
    _router: Router;
    listFilter = '';
    institutes: iInstitute[];
    instituteDetail: iInstitute;
    selectedInstituteDetail: any;
    // pager object
    pager: any = {};
    // paged items
    pagedItems: any[];
    modalReference: any;
    closeResult: string;
    model: any = {
        searchText: '',
    };
    loading = false;
    message: string;
    currentUpload: Upload;
    states: any[];
    uploadingImageLoading: any;
    years: any[] = CONFIG.YEARS;
    months: any[] = CONFIG.MONTHS;
    selectedMonth: any = this.months[0];
    selectedYear: any = this.years[0];
    deleteModelReference: any;
    timeZones: any;


    constructor(
        private router: Router,
        private modalService: NgbModal,
        private instituteService: InstituteService,
        private alertService: AlertService,
        private pagerService: PagerService,
        private auth: LoginUserService,
        private upSvc: UploadService,
        public toastr: ToastsManager, vcr: ViewContainerRef,
        private schoolMgmt: SchoolMgmtService,
        public util: Util,
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }


    onlyNumberKey(event) {
        return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
    }
    onlyAlphabetKey(event) {
        return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123);
    }
    ngOnInit() {
        this.getAllInstitute();
        this.getStateAndDistricts();
        this.getTimeZones();
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


    getAllInstitute() {
        this.instituteService.getInstitute()
            .subscribe(
            institutes => {
                if (institutes) {
                    this.institutes = institutes.sort(function (a, b) {
                        return (a.createdDate < b.createdDate) ? 1 : ((b.createdDate < a.createdDate) ? -1 : 0);
                    });
                    this.setPage(1, this.institutes);
                    this.filterInstititeByYearOrMonth(true);
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

    openModelWithDetail(content, instituteDetail) {
        this.selectedInstituteDetail = instituteDetail;
        this.modalService.open(content, { size: 'lg' });
    }

    openDeleteModel(content, instituteDetail) {
        this.selectedInstituteDetail = instituteDetail;
        this.deleteModelReference = this.modalService.open(content, { size: 'lg' });
    }

    setPage(page: number, institute?: any) {
        institute = institute ? institute : this.institutes;
        if (page < 1 || page > this.pager.totalPages && (institute.length < 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(institute.length, page);
        // get current page of items
        this.pagedItems = institute.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    open(content, selectedModel) {
        this.model = this.getModelObject(selectedModel);
        this.modalReference = this.modalService.open(content, { size: 'lg' });
        this.modalReference.result.then((result) => {
            this.resetModelAndMessage();
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.resetModelAndMessage();
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    getModelObject(selectedModel) {
        return {
            instituteID: selectedModel.instituteID,
            instituteCode: selectedModel.instituteCode,
            instituteName: selectedModel.instituteName,
            instituteLogo: selectedModel.instituteLogo,
            userID: selectedModel.userID,
            userName: selectedModel.adminName,
            email: selectedModel.adminEmailID,
            mobile: selectedModel.adminMobile,
            instituteAddress: selectedModel.instituteAddress ? selectedModel.instituteAddress.address : '',
            instituteCity: selectedModel.instituteAddress ? selectedModel.instituteAddress.city : '',
            instituteDistrict: selectedModel.instituteAddress ? selectedModel.instituteAddress.district : '',
            instituteState: selectedModel.instituteAddress ? selectedModel.instituteAddress.state : '',
            institutePinCode: selectedModel.instituteAddress ? selectedModel.instituteAddress.pincode : '',
            sms: selectedModel.sms ? selectedModel.sms : '',
            features: selectedModel.features ? selectedModel.features : []
        };
    }

    private getDismissReason(reason: any): string {
        this.message = '';
        this.model = {};
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdp';
        } else {
            return `with: ${reason}`;
        }
    }

    updateInstitute(content) {
        this.instituteService.updateInstitute(this.model, this.model.url)
            .subscribe(
            data => {
                if (!data.error) {
                    this.getAllInstitute();
                    this.modalReference.dismiss('Manually');
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

    deleteInstitute(institute) {
        const data = {
            instituteID: institute.instituteID
        };
        this.instituteService.deleteInstitute(data)
            .subscribe(
            response => {
                if (!response.error) {
                    this.toastr.success('Institute deleted successfully');
                    // refresh the list
                    this.getAllInstitute();
                    this.deleteModelReference.dismiss('Manually');
                } else {
                    this.toastr.error(response.error);
                }

            },
            error => {
                this.toastr.error('Unable to delete, Please try again later...');
            },
        );
    }

    filterInstititeByYearOrMonth(flag?: boolean) {
        let sCopy = JSON.parse(JSON.stringify(this.institutes));
        if (this.selectedYear !== 'All') {
            sCopy = sCopy.filter(s => {
                var date = new Date(s.createdDate);
                if (date.getFullYear() === this.selectedYear) {
                    return true;
                } else {
                    return false;
                }
            });
        }
        if (this.selectedMonth && this.selectedMonth.value !== 'All') {
            sCopy = sCopy.filter(s => {
                var date = new Date(s.createdDate);
                if (date.getMonth() === this.selectedMonth.key) {
                    return true;
                } else {
                    return false;
                }
            });
        }
        sCopy = sCopy.sort(function (a, b) {
            return (a.createdDate < b.createdDate) ? 1 : ((b.createdDate < a.createdDate) ? -1 : 0);
        });
        if (sCopy.length > 0) {
            this.setPage(1, sCopy);
        } else {
            this.pagedItems = sCopy;
        }
    }

    onChangeClass(event: any, query: string) {
        if (query === 'year') {
            this.selectedYear = event;
        }
        if (query === 'month') {
            this.selectedMonth = event;
        }
        this.filterInstititeByYearOrMonth();
    }

    resetModelAndMessage() {
        this.model = {};
        this.message = '';
    }
}
