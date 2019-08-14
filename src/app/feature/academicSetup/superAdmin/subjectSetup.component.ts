import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AcademicSetupService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import * as _ from 'underscore';
import { filter } from 'rxjs/operator/filter';

@Component({
  selector: 'app-super-admin-subject-setup',
  templateUrl: './subjectSetup.component.html',
})
export class SuperAdminSubjectSetupComponent  implements OnInit {
  _router: Router;
  listFilter= '';
  subjects: any;
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
    ) { }

    ngOnInit() {
        this.academicSetup.getAllSubject()
        .subscribe(
            subjects => {
                if (subjects) {
                    this.subjects = subjects;
                } else {
                }
            },
            error => {
            }
        );
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
            id: model.id,
            subjectName: model.subjectName,
        };
    }



    submitSubject() {
        if (this.classMode === 'add') {
            this.addSubject();
        } else {
            this.updateSubject();
        }
    }

    addSubject() {
        this.model.id = this.subjects.length + 1;
        this.academicSetup.createSubject(this.model)
        .subscribe(
            subjects => {
                if (subjects) {
                    this.subjects.unshift(subjects);
                    this.modalReference.dismiss('Manually');
                } else {

                }
            },
            error => {
                this.message = 'Unable to create.';
            },
        );
    }

    updateSubject() {
        this.academicSetup.updateSubject(this.model)
        .subscribe(
            subjects => {
                if (subjects) {
                    this.subjects = this.subjects.filter(cl => {
                        return cl.id !== subjects.id;
                    });
                    this.subjects.unshift(subjects);
                    this.modalReference.dismiss('Manually');
                } else {

                }
            },
            error => {
                this.message = 'Unable to update.';
            },
        );
    }



}

// function newFunction(): string {
//     return '<app-super-admin-subject-setup>';
// }

