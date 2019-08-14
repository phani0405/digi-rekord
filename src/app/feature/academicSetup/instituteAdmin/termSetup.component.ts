import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AcademicSetupService, LoginUserService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import * as _ from 'underscore';
import { filter } from 'rxjs/operator/filter';
import { OrderByPipe } from '../../../helpers/filters/filter';
import { AlertService } from '../../../helpers/services/service';

@Component({
    selector: 'app-institute-admin-term-setup',
    templateUrl: './termSetup.component.html',
})
export class InstituteAdminTermSetupComponent implements OnInit {
    terms: any = [];
    model: any = {};
    loading = false;
    message: string;
    titleText: string;
    modalReference: any;
    actionType: any;

    constructor(
        private modalService: NgbModal,
        private academicSetup: AcademicSetupService,
        private alert: AlertService,
        private auth: LoginUserService,
    ) { }

    ngOnInit() {
        this.terms = this.auth.termDetail;
    }

    openTermModel(content, selectedModel) {
        this.model = selectedModel ? this.getTermModelObject(selectedModel) : {};
        this.titleText = selectedModel ? 'Edit Term' : 'Add Term';
        this.actionType = selectedModel ? 'edit' : 'add';
        this.modalReference = this.modalService.open(content);
        this.modalReference.result.then((result) => {
            this.message = '';
            this.model = {};
        }, (reason) => {
            this.message = '';
            this.model = {};
        });
    }

    getTermModelObject(model) {
        return {
            id: model.id,
            termID: model.termID,
            termName: model.termName
        };
    }

    submitTerm(formData?: any) {
        this.message = '';
        if (formData && formData.required) {
            this.message = 'Term Name is required !';
            return;
        }
        if (formData && formData.pattern) {
            this.message = 'First letter should be albhabetic !';
            return;
        }
        if (this.actionType === 'add') {
            this.addTerm();
        } else {
            this.updateTerm();
        }
    }

    addTerm() {
        this.academicSetup.createTerms(this.model)
            .subscribe(
            terms => {
                if (terms) {
                    this.model = {};
                    this.auth.termDetail = terms.termDetails;
                    this.terms = this.auth.termDetail;
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

    updateTerm() {
        this.academicSetup.updateTerms(this.model)
            .subscribe(
            terms => {
                if (terms) {
                    this.auth.termDetail = terms.termDetails;
                    this.terms = this.auth.termDetail;
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

function newFunction(): string {
    return '<app-institute-admin-term-setup>';
}

