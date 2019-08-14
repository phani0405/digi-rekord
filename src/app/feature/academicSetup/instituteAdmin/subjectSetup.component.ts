import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AcademicSetupService, LoginUserService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import * as _ from 'underscore';
import { filter } from 'rxjs/operator/filter';

@Component({
  selector: 'app-institute-admin-subject-setup',
  templateUrl: './subjectSetup.component.html',
})
export class InstituteAdminSubjectSetupComponent  implements OnInit {
  _router: Router;
  listFilter= '';
  subjects: any = [];
  url: string;
  model: any = {};
  loading = false;
  message: string;
  titleText: string;
  modalReference: any;
  classMode: any;

    constructor(
        private router: Router,
        private modalService: NgbModal,
        private academicSetup: AcademicSetupService,
        private auth: LoginUserService,
    ) { }

    ngOnInit() {
        this.subjects = this.auth.subjectDetail;
    }

    openSubjectModel(content, selectedModel) {
        this.model = selectedModel ? this.getSubjectModelObject(selectedModel) : {} ;
        this.titleText = selectedModel ? 'Edit Subject' : 'Add Subject';
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

    getSubjectModelObject(model) {
        return {
            subjectName: model.subjectName,
            subjectID: model.subjectID,
        };
    }



    submitSubject(formData? : any) {
        this.message = '';
        if(formData && formData.required) {
            this.message = 'Subject Name is required !';
            return;
        }
        if(formData && formData.pattern) {
            this.message = 'First letter should be albhabetic !';
            return;
        }
        if (this.classMode === 'add') {
            this.addSubject();
        } else {
            this.updateSubject();
        }
    }

    addSubject() {
        this.academicSetup.createSubject(this.model)
        .subscribe(
            subjects => {
                if (subjects) {
                    this.model = {};
                    this.auth.subjectDetail = subjects.subjectDetails;
                    this.subjects = this.auth.subjectDetail;
                    this.modalReference.dismiss('Manually');
                } else {
                    this.message = 'Unable to create.';
                }
            },
            error => {
                const errorData = this.auth.handleResponse(error);
                if (errorData) {
                    this.message = 'Something went wrong, Please try again later' ;
                } else {
                    this.modalReference.dismiss('Manually');
                }
            },
        );
    }

    updateSubject() {
        this.academicSetup.updateSubject(this.model)
        .subscribe(
            subjects => {
                if (subjects) {
                    this.auth.subjectDetail = subjects.subjectDetails;
                    this.subjects = this.auth.subjectDetail;
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
    return '<app-institute-admin-subject-setup>';
}

