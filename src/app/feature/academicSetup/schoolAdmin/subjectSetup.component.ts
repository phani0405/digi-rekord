import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AcademicSetupService, InstituteService, LoginUserService, SchoolMgmtService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import * as _ from 'underscore';
import { filter } from 'rxjs/operator/filter';

@Component({
    selector: 'app-school-admin-subject-setup',
    templateUrl: './subjectSetup.component.html',
})
export class SchoolAdminSubjectSetupComponent implements OnInit {
    subjects: any;
    classes: any;
    loading = false;
    message: string;
    titleText: string;
    selection: any;
    instituteDetail: any;
    classDetails: any;
    classSubjectMap: any;
    terms: any;
    instituteTerms: any;

    constructor(
        private academicSetupService: AcademicSetupService,
        private instituteService: InstituteService,
        private auth: LoginUserService,
        private schoolService: SchoolMgmtService,
        public toastr: ToastsManager, vcr: ViewContainerRef,
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        const instituteId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
        this.instituteService.getInstituteByUserId(instituteId)
            .subscribe(
            institutes => {
                if (institutes && institutes.length > 0) {
                    this.instituteDetail = institutes[0];
                    this.auth.subjectDetail = this.instituteDetail.subjectDetails;
                    this.auth.classDetail = this.instituteDetail.classDetails;
                    this.auth.termDetail = this.instituteDetail.termDetails;
                    this.classes = this.auth.classDetail;
                    this.subjects = this.auth.subjectDetail;
                    this.instituteTerms = this.auth.termDetail;
                    this.getSchoolClassDetails();
                } else {
                }
            },
            error => {
            },
        );
    }

    getSchoolClassDetails() {
        const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
        this.schoolService.getSchoolDetail(schoolId)
            .subscribe(
            schoolDetail => {
                if (schoolDetail) {
                    this.classDetails = schoolDetail.classDetails;
                    this.classSubjectMap = this.getClassObjectMap();
                    if(this.instituteTerms) {
                        this.terms = this.getCheckTerms(schoolDetail.termDetails, this.instituteTerms)
                    }
                } else {
                }
            },
            error => {
            },
        );
    }

    getCheckTerms(schoolTerm, instituteTerms) {
        let instituteTermsCopy: any = instituteTerms.map(function (el) {
            const o = Object.assign({}, el);
            o.checked = false;
            return o;
        });
        let schoolTermCopy: any = schoolTerm.map(function (el) {
            const o = Object.assign({}, el);
            o.checked = true;
            return o;
        });
        const schoolTermsWithCheck = _.values(_.extend(_.indexBy(instituteTermsCopy, 'termInstituteID'), _.indexBy(schoolTermCopy, 'termInstituteID')))
        return schoolTermsWithCheck;
    }

    getClassObjectMap() {
        const sDWithCheck = this.subjects.map(function (el) {
            const o = Object.assign({}, el);
            o.checked = false;
            return o;
        });

        const cDWithCheck = this.classes.map(function (el) {
            const o = Object.assign({}, el);
            const subDet = JSON.parse(JSON.stringify(sDWithCheck));
            o.subjectDetails = [];
            o.subjectDetails = (subDet);
            return o;
        });

        for (let i = 0, ilen = this.classDetails.length; i < ilen; i++) {
            const obj1 = this.classDetails[i];
            const subObj1 = obj1.subjectDetails;

            for (let j = 0, jlen = cDWithCheck.length; j < jlen; j++) {

                const obj2 = cDWithCheck[j];
                const subObj2 = obj2.subjectDetails;
                if (obj1.classID === obj2.classID) {
                    for (let x = 0, xlen = subObj1.length; x < xlen; x++) {
                        const subObj11 = subObj1[x];
                        for (let y = 0, ylen = subObj2.length; y < ylen; y++) {
                            const subObj12 = subObj2[y];
                            if (subObj11.subjectID === subObj12.subjectID) {
                                subObj12.checked = true;
                            }
                        }
                    }
                }
            }
        }
        return cDWithCheck;
    }

    selectedOptions() { // right now: ['1','3']
        return this.classSubjectMap
            .filter(opt => opt.checked)
            .map(opt => opt);
    }

    saveSubject() {
        const classSubjectMapCopy = JSON.parse(JSON.stringify(this.classSubjectMap));
        const filteredCSM = classSubjectMapCopy.filter((scs) => {
            const selectedSubject = scs.subjectDetails.filter((sdm) => {
                if (sdm.checked) {
                    delete sdm['checked'];
                    return true;
                } else {
                    return false;
                }
            });
            if (selectedSubject.length > 0) {
                scs.subjectDetails = selectedSubject;
                return true;
            } else {
                return false;
            }
        });
        this.academicSetupService.assignClassSubject(filteredCSM)
            .subscribe(
            isUpdated => {
                if (isUpdated) {
                    this.toastr.success('Class and subject assigned successfully');
                    this.getSchoolClassDetails();
                } else {
                    this.toastr.error('Class and subject assigned failed, Please try again later');
                }
            },
            error => {
            },
        );
    }

    saveTerms() {
        const termsCopy = JSON.parse(JSON.stringify(this.terms));
        const selectedTerms = termsCopy.filter((sdm) => {
            if (sdm.checked) {
                delete sdm['checked'];
                return true;
            } else {
                sdm['isDelete']=true;
                delete sdm['checked'];
                return true;
            }
        });
        this.academicSetupService.assignTerms(selectedTerms)
            .subscribe(
            isUpdated => {
                if (isUpdated) {
                    this.toastr.success('Terms assigned successfully');
                    this.getSchoolClassDetails();
                } else {
                    this.toastr.error('Unable to submit terms, Please try again later');
                }
            },
            error => {
                this.toastr.error('Unable to submit terms, Please try again later');
            },
        );
    }
}

function newFunction(): string {
    return '<app-school-admin-subject-setup>';
}

