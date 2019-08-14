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
    selector: 'app-institute-admin-class-setup',
    templateUrl: './classSetup.component.html',
})
export class InstituteAdminClassSetupComponent implements OnInit {
    _router: Router;
    listFilter = '';
    classes: any = [];
    url: string;
    model: any = {};
    loading = false;
    message: string;
    titleText: string;
    modalReference: any;
    classMode: any;
    boards = ['CBSE', 'ICSE', 'IGCSE', 'State Board']

    constructor(
        private router: Router,
        private modalService: NgbModal,
        private academicSetup: AcademicSetupService,
        private alert: AlertService,
        private auth: LoginUserService,
    ) { }

    ngOnInit() {
        this.classes = this.auth.classDetail;
    }

    openClassModel(content, selectedModel) {
        this.model = selectedModel ? this.getClassModelObject(selectedModel) : {};
        this.titleText = selectedModel ? 'Edit Class' : 'Add Class';
        this.classMode = selectedModel ? 'edit' : 'add';
        this.modalReference = this.modalService.open(content);
        this.modalReference.result.then((result) => {
            this.message = '';
            this.model = {};
        }, (reason) => {
            this.message = '';
            this.model = {};
        });
    }

    getClassModelObject(model) {
        return {
            id: model.id,
            classID: model.classID,
            className: model.className,
            board: model.board
        };
    }



    submitClass(formData?: any) {
        this.message = '';
        if (formData && formData.required) {
            this.message = 'Class Name is required !';
            return;
        }
        if (formData && formData.pattern) {
            this.message = 'First letter should be albhabetic !';
            return;
        }
        if (this.classMode === 'add') {
            this.addClass();
        } else {
            this.updateClass();
        }
    }

    addClass() {
        this.academicSetup.createClasses(this.model)
            .subscribe(
            classes => {
                if (classes) {
                    this.model = {};
                    this.auth.classDetail = classes.classDetails;
                    this.classes = this.auth.classDetail;
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

    updateClass() {
        this.academicSetup.updateClasses(this.model)
            .subscribe(
            classes => {
                if (classes) {
                    this.auth.classDetail = classes.classDetails;
                    this.classes = this.auth.classDetail;
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
    return '<app-institute-admin-class-setup>';
}

