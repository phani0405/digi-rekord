import { StudentMgmtService } from '../../../helpers/services/studentMgmt.service';
import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '../../../helpers/services/pagination.service';
import { AlertService, LoginUserService, SchoolMgmtService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import * as _ from 'underscore';
import { FeeService } from '../../../helpers/services/service';
import { StudentFilterPipe } from '../../../helpers/filters/filter';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Upload } from '../../../helpers/models/upload-file.models';
import { UploadService } from '../../../helpers/services/upload-file.service';
import { Util } from '../../../helpers/util'; 
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-fee-setup',
  templateUrl: './fee-setup.component.html'
  // styles: ['.custom {color : blue}'],
})

export class FeeSetupComponent implements OnInit {
  _router: Router;
    listFilter = '';
    feeTypes: any = [];
    url: string;
    model: any = {};
    loading = false;
    message: string;
    titleText: string;
    modalReference: any;
    feeTypeMode: any;
    boards = ['CBSE', 'ICSE', 'IGCSE', 'State Board']
    fees: any = [];
    feeMode: any;
    feeTermMode: any;
    feeTerms: any;
    students: any;
    studentDetail: any;
    selectedStudentDetail: any;

    constructor(
        private router: Router,
        private modalService: NgbModal,
        private feeService: FeeService,
        private alert: AlertService,
        private auth: LoginUserService,
        private studentService: StudentMgmtService
    ) { }

  ngOnInit() { 
    this.getFeeTypes();
    this.getFeeTerms();
    this.getFees();
  }

    openFeeTypeModel(content, selectedModel) {
        this.model = selectedModel ? this.getFeeTypeObject(selectedModel) : {};
        this.titleText = selectedModel ? 'Edit Fee type' : 'Add Fee type';
        this.feeTypeMode = selectedModel ? 'edit' : 'add';
        this.modalReference = this.modalService.open(content);
        this.modalReference.result.then((result) => {
            this.message = '';
            this.model = {};
        }, (reason) => {
            this.message = '';
            this.model = {};
        });
    }

    getFeeTypeObject(model) {
        return model;
    }

    submitFeeType(formData?: any) {
        this.message = '';
        if (formData && formData.required) {
            this.message = 'Fee type is required !';
            return;
        }
        if (formData && formData.pattern) {
            this.message = 'First letter should be albhabetic !';
            return;
        }
        if (this.feeTypeMode === 'add') {
            this.addFeeType();
        } else {
            this.updateFeeType();
        }
    }

    getFeeTypes() {
        this.feeService.getFeeTypes()
            .subscribe(
            feeTypes => {
                if (feeTypes) {
                    this.feeTypes = feeTypes;
                } else {
                    this.message = 'No record found!';
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
            },
        );
    }

    addFeeType() {
        this.feeService.createFeeType(this.model)
            .subscribe(
            feeTypes => {
                if (feeTypes) {
                    this.feeTypes=[];
                    this.getFeeTypes();
                    this.modalReference.dismiss('Manually');
                } else {
                    this.message = 'Unable to create, Please try again later';
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
            },
        );
    }

    updateFeeType() {
        this.feeService.updateFeeType(this.model)
            .subscribe(
            feeTypes => {
                if (feeTypes) {
                    this.getFeeTypes();
                    this.modalReference.dismiss('Manually');
                } else {
                    this.message = 'Unable to update.';
                }
            },
            error => {
                this.message = 'Unable to update.';
            },
        );
    }
    
    openFeeTermsModel(content, selectedModel) {
        this.model = selectedModel ? this.getFeeTermObject(selectedModel) : {};
        this.titleText = selectedModel ? 'Edit Fee term' : 'Add Fee term';
        this.feeTermMode = selectedModel ? 'edit' : 'add';
        this.modalReference = this.modalService.open(content);
        this.modalReference.result.then((result) => {
            this.message = '';
            this.model = {};
        }, (reason) => {
            this.message = '';
            this.model = {};
        });
    }

    getFeeTermObject(model) {
        return model;
    }

    submitFeeTerm(formData?: any) {
        this.message = '';
        if (formData && formData.required) {
            this.message = 'Fee term is required !';
            return;
        }
        if (formData && formData.pattern) {
            this.message = 'First letter should be albhabetic !';
            return;
        }
        if (this.feeTermMode === 'add') {
            this.addFeeTerm();
        } else {
            this.updateFeeTerm();
        }
    }

    getFeeTerms() {
        this.feeService.getFeeTerms()
            .subscribe(
            feeTerms => {
                if (feeTerms) {
                    this.feeTerms = feeTerms;
                } else {
                    this.message = 'No records found!';
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
            },
        );
    }

    addFeeTerm() {
        this.feeService.createFeeTerm(this.model)
            .subscribe(
            fees => {
                if (fees) {
                    this.feeTerms=[];
                    this.getFeeTerms();
                    this.modalReference.dismiss('Manually');
                } else {
                    this.message = 'Unable to create, Please try again later';
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
            },
        );
    }

    updateFeeTerm() {
        this.feeService.updateFeeTerm(this.model)
            .subscribe(
            fees => {
                if (fees) {
                    this.getFeeTerms();
                    this.modalReference.dismiss('Manually');
                } else {
                    this.message = 'Unable to update.';
                }
            },
            error => {
                this.message = 'Unable to update.';
            },
        );
    }

    openFeesModel(content, selectedModel) {
        this.model = selectedModel ? this.getFeeObject(selectedModel) : {};
        this.titleText = selectedModel ? 'Edit Fee' : 'Add Fee';
        this.feeMode = selectedModel ? 'edit' : 'add';
        this.modalReference = this.modalService.open(content, { size: 'lg' });
        this.modalReference.result.then((result) => {
            this.message = '';
            this.model = {};
        }, (reason) => {
            this.message = '';
            this.model = {};
        });
    }

    getFeeObject(model) {
        return model;
    }

    submitFee(formData?: any) {
        this.message = '';
        if (formData && formData.required) {
            this.message = 'Fee type is required !';
            return;
        }
        if (formData && formData.pattern) {
            this.message = 'First letter should be albhabetic !';
            return;
        }
        if (this.feeMode === 'add') {
            this.addFee();
        } else {
            this.updateFee();
        }
    }

    getFees() {
        this.feeService.getFees()
            .subscribe(
            fees => {
                if (fees) {
                    this.fees = fees;
                } else {
                    this.message = 'No records found!';
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
            },
        );
    }

    addFee() {
        this.feeService.createFee(this.model)
            .subscribe(
            fees => {
                if (fees) {
                    this.fees=[];
                    this.getFees();
                    this.modalReference.dismiss('Manually');
                } else {
                    this.message = 'Unable to create, Please try again later';
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
            },
        );
    }

    updateFee() {
        this.feeService.updateFee(this.model)
            .subscribe(
            fees => {
                if (fees) {
                    this.getFees();
                    this.modalReference.dismiss('Manually');
                } else {
                    this.message = 'Unable to update.';
                }
            },
            error => {
                this.message = 'Unable to update.';
            },
        );
    }
}