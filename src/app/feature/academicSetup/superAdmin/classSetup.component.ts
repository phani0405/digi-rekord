import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AcademicSetupService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import * as _ from 'underscore';
import { filter } from 'rxjs/operator/filter';
import { OrderByPipe } from '../../../helpers/filters/filter';

@Component({
  selector: 'app-super-admin-class-setup',
  templateUrl: './classSetup.component.html',
})
export class SuperAdminClassSetupComponent implements OnInit {
  _router: Router;
  listFilter= '';
  classes: any;
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
        this.academicSetup.getAllClasses()
        .subscribe(
            classes => {
                if (classes) {
                    this.classes = classes;
                } else {
                }
            },
            error => {
            }
        );
    }

    openClassModel(content, selectedModel) {
        this.model = selectedModel ? this.getClassModelObject(selectedModel) : {} ;
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
            className: model.className,
        };
    }



    submitClass() {
        if (this.classMode === 'add') {
            this.addClass();
        } else {
            this.updateClass();
        }
    }

    addClass() {
        this.model.id = this.classes.length + 1;
        this.academicSetup.createClasses(this.model)
        .subscribe(
            classes => {
                if (classes) {
                    this.classes.unshift(classes);
                    this.modalReference.dismiss('Manually');
                } else {

                }
            },
            error => {
                this.message = 'Unable to create.';
            },
        );
    }

    updateClass() {
        this.academicSetup.updateClasses(this.model)
        .subscribe(
            classes => {
                if (classes) {
                    this.classes = this.classes.filter(cl => {
                        return cl.id !== classes.id;
                    });
                    this.classes.unshift(classes);
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
//     return '<app-super-admin-class-setup>';
// }

