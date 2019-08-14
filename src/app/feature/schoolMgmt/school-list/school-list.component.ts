import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '../../../helpers/services/pagination.service';
import { SchoolMgmtService, AlertService, LoginUserService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import * as _ from 'underscore';
import { Institute } from '../../../helpers/models/institute';
import { InstituteService } from '../../../helpers/services/service';
import { Upload } from '../../../helpers/models/upload-file.models';
import { UploadService } from '../../../helpers/services/upload-file.service';
import { SchoolFilterPipe } from '../../../helpers/filters/filter';
import { Util } from '../../../helpers/util';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss'],
  // styles: ['.custom {color : blue}'],
})
export class SchoolListComponent implements OnInit {
  _router: Router;
  listFilter= '';
  schools: any;
  schoolDetail: any;
  selectedSchoolDetail: any;
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
  deleteModelReference : any; 

    constructor(
        private router: Router,
        private modalService: NgbModal,
        private schoolMgmtService: SchoolMgmtService,
        private alertService: AlertService,
        private pagerService: PagerService,
        private institute: Institute,
        private auth: LoginUserService,
        private upSvc: UploadService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef,
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
        this.getAllSchools();
        this.getStateAndDistricts();
    }

    getStateAndDistricts() {
        this.schoolMgmtService.getDistricts().subscribe(
            data => {
                if (data.districts) {
                    this.states = data.districts;
                } else {
                    console.log("Data error");
                }
            },
        );
    }

    getAllSchools() {
        this.schoolMgmtService.getSchool()
        .subscribe(
            schools => {
                if (schools) {
                    this.schools = schools.sort(function(a, b) {
                        return (a.createdDate < b.createdDate) ? 1 : ((b.createdDate < a.createdDate) ? -1 : 0);
                    });
                    this.setPage(1, this.schools);
                    this.filterSchoolByYearOrMonth(true); 
                } else {
                }
            },
        );
    }

    openModelWithDetail(content, schoolDetail) {
        this.selectedSchoolDetail = schoolDetail;
        this.modalService.open(content, {size : 'lg'});
    }

    openDeleteModel(content, schoolDetail) {
        this.selectedSchoolDetail = schoolDetail;
        this.deleteModelReference = this.modalService.open(content, {size : 'lg'});
    }

    setPage(page: number, school? : any) { 
        school = school ? school : this.schools; 
        if (page < 1 || page > this.pager.totalPages && (school.length < 0 )) { 
            return; 
        } 
        // get pager object from service
        this.pager = this.pagerService.getPager(school.length, page);
        // get current page of items
        this.pagedItems = school.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    open(content, selectedModel) {
        this.model = this.getModelObject(selectedModel);
        this.modalReference = this.modalService.open(content, {size : 'lg'});
        this.modalReference.result.then((result) => {
            this.resetModelAndMessage()
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.resetModelAndMessage()
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    resetModelAndMessage() {
        this.model = {};
        this.message = '';
    }

    getModelObject(selectedModel) {
        return {
            id : selectedModel.id,
            schoolID: selectedModel.schoolID,
            schoolCode : selectedModel.schoolCode,
            schoolName: selectedModel.schoolName,
            schoolLogo: selectedModel.schoolLogo,
            userID: selectedModel.userID,
            userName: selectedModel.adminName,
            email: selectedModel.adminEmailID,
            mobile: selectedModel.adminMobile,
            schoolAddress: selectedModel.schoolAddress ? selectedModel.schoolAddress.address : '',
            schoolCity: selectedModel.schoolAddress ? selectedModel.schoolAddress.city : '',
            schoolDistrict: selectedModel.schoolAddress ? selectedModel.schoolAddress.district : '',
            schoolState: selectedModel.schoolAddress ? selectedModel.schoolAddress.state : '',
            schoolPinCode: selectedModel.schoolAddress ? selectedModel.schoolAddress.pincode : '',
            openTime: this.getOpenCloseTimeObject(selectedModel.schoolOpenTime),
            closeTime: this.getOpenCloseTimeObject(selectedModel.schoolCloseTime),
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
            return  `with: ${reason}`;
        }
    }

    updateSchool(content) {
        this.model.schoolOpenTime = this.getSchoolOpenCloseTime(this.model.openTime);
        this.model.schoolCloseTime = this.getSchoolOpenCloseTime(this.model.closeTime);
        this.schoolMgmtService.updateSchool(this.model, this.model.url)
        .subscribe(
            data => {
                if (!data.error) {
                    this.message = '';
                    this.model = {};
                    this.modalReference.dismiss('Manually');
                    this.getAllSchools();
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
                        const upload: any = success;
                        this.uploadingImageLoading = false; 
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

    getOpenCloseTimeObject(time) {
        let hours: number;
        if (time) {
            hours = time.includes('PM') ? 12 : 0;
            const timeArray = time.split(':');
            hours = parseInt(timeArray[0], 10);
            if (time.includes('PM')) {
                hours = hours + 12;
            } else {
                if (hours > 11) {
                    hours = hours - 12;
                }
            }
            return {
                hour : hours,
                minute: parseInt(timeArray[1].split(' ')[0], 10),
            };
        } else {
            return;
        }
    }

    deleteSchool(school) {
        const data = {
            schoolID: school.schoolID,
            updatedBy: this.auth.userId(),
        };
        this.schoolMgmtService.deleteSchool(data)
        .subscribe(
            response => {
                if(!response.error) {
                    this.toastr.success('School deleted successfully');
                    // refresh the list
                    this.deleteModelReference.dismiss('Manually'); 
                    this.getAllSchools();
                } else {
                    this.toastr.error(response.error);
                }
              },
              error => {
                  this.toastr.error('Unable to delete, please try again later');
            },
        );
    }

    filterSchoolByYearOrMonth(flag? : boolean) {
        let sCopy = JSON.parse(JSON.stringify(this.schools));
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
        if ( this.selectedMonth && this.selectedMonth.value !== 'All') {
            sCopy = sCopy.filter(s => {
                var date = new Date(s.createdDate);
                if (date.getMonth() === this.selectedMonth.key) {
                    return true;
                } else {
                    return false;
                }
            });
        }
        sCopy = sCopy.sort(function(a, b) {
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
        this.filterSchoolByYearOrMonth();
    }
    
}
