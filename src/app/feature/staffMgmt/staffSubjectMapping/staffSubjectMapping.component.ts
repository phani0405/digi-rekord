import { Component, OnInit, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { StaffMgmtService, InstituteService, LoginUserService, SchoolMgmtService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import * as _ from 'underscore';
import { filter } from 'rxjs/operator/filter';

@Component({
  selector: 'app-staff-subject-mapping',
  templateUrl: './staffSubjectMapping.component.html',
})
export class StaffSubjectMappingComponent  implements OnInit {
    @Input() staffDetail: any;
    @Output() assign: EventEmitter<any> = new EventEmitter();
    subjects: any;
    classes: any;
    loading = false;
    message: string;
    titleText: string;
    selection: any;
    instituteDetail: any;
    classSubjectDetails: any;
    classSubjectMap: any;
    modalReference: any;
    closeResult: any;
    modalContent: any;
    classTeacherDetails: any;
    classTeacherMap: any;

    constructor(
          private staffMgmtService: StaffMgmtService,
          private auth: LoginUserService,
          private schoolService: SchoolMgmtService,
          public toastr: ToastsManager, vcr: ViewContainerRef,
          private modalService: NgbModal,
    ) {
        this.toastr.setRootViewContainerRef(vcr);
     }

    ngOnInit() {
        // if (!this.auth.schoolDetail) {
        //     this.getSchoolClassDetails();
        // }
    }

    open(content) {
        this.modalContent = content;
        if (this.auth.schoolDetail && this.auth.schoolDetail.classDetails) {
            const schoolDetail = this.auth.schoolDetail;
            this.classes = this.getClasses(schoolDetail.classDetails);
            this.subjects = this.getSubject(schoolDetail.classDetails);
            this.classSubjectDetails = this.staffDetail.subjects;
            this.classTeacherDetails = this.staffDetail.classTeacherDetails;
            this.classSubjectMap = this.getClassObjectMap();
            this.classTeacherMap = this.getClassTeacherMap();
            this.modalReference = this.modalService.open(content, {size : 'lg'});
            this.modalReference.result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        } else {
            // this.toastr.error('Something went wrong, Please try again later');
            this.getSchoolClassDetails();
        }

    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a back';
        } else {
            return  `with: ${reason}`;
        }
    }

    getClasses(classes) {
        const classCopy = JSON.parse(JSON.stringify(classes));
        return classCopy.map((c) => {
            delete c['subjectDetails'];
            return c;
        });
    }

    getSubject(classes) {
        const classCopy = JSON.parse(JSON.stringify(classes));
        const subjectArray = [];
        classCopy.forEach(item => {
            const subjectDetail = item.subjectDetails;
            subjectDetail.forEach(subjectItem => {
                subjectArray.push(subjectItem);
            });
        });
        const uniqueSubject = _.uniq(subjectArray, function(x){
            return x.subjectID;
        });
        return uniqueSubject;
    }

    getSchoolClassDetails() {
        const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
        this.schoolService.getSchoolDetail(schoolId)
        .subscribe(
            schoolDetail => {
                if (schoolDetail && schoolDetail.classDetails) {
                    this.open(this.modalContent);
                    this.auth.schoolDetail = schoolDetail;
                    this.classes = this.getClasses(schoolDetail.classDetails);
                    this.subjects = this.getSubject(schoolDetail.classDetails);
                } else {
                    this.toastr.error('Something went wrong, Please try again later');
                }
            },
            error => {
            },
        );
    }

    getClassObjectMap() {

        const cDWithCheck = this.classes.map(function(el) {
            const o = Object.assign({}, el);
            o.checked = false;
            return o;
        });

        const sDWithCheck = this.subjects.map(function(el) {
            const o = Object.assign({}, el);
            const subDet = JSON.parse(JSON.stringify(cDWithCheck));
            o.classDetails = [];
            o.classDetails = (subDet);
            return o;
        });

        for (let i = 0, ilen = this.classSubjectDetails.length; i < ilen; i++) {
            const obj1 = this.classSubjectDetails[i];
            const classObj1 = obj1.classDetails;

            for (let j = 0, jlen = sDWithCheck.length; j < jlen; j++) {

                const obj2 = sDWithCheck[j];
                const classObj2 = obj2.classDetails;
                if (obj1.subjectID === obj2.subjectID) {
                    for (let x = 0, xlen = classObj1.length; x < xlen; x++) {
                        const classObj11 = classObj1[x];
                        for (let  y = 0, ylen = classObj2.length; y < ylen; y++) {
                            const classObj12 = classObj2[y];
                            if (classObj11.classID === classObj12.classID) {
                                classObj12.checked = true;
                            }
                        }
                    }
                }
            }
        }
        return sDWithCheck;
    }

    getClassTeacherMap() {
        const cDWithCheck = this.classes.map(function(el) {
            const o = Object.assign({}, el);
            o.checked = false;
            return o;
        });

        for (let i = 0, ilen = this.classTeacherDetails.length; i < ilen; i++) {
            const obj1 = this.classTeacherDetails[i];
            for (let j = 0, jlen = cDWithCheck.length; j < jlen; j++) {
                const obj2 = cDWithCheck[j];
                if (obj1.classID === obj2.classID) {
                    obj2.checked = true;
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
        const classTeacherMapCopy = JSON.parse(JSON.stringify(this.classTeacherMap));
        const filteredCSM = classSubjectMapCopy.filter((scs) => {
            const selectedClass = scs.classDetails.filter((sdm) => {
                if (sdm.checked) {
                    delete sdm['checked'];
                    return true;
                } else {
                    return false;
                }
            });
            if (selectedClass.length > 0) {
                scs.classDetails = selectedClass;
                return true;
            } else {
                scs['isDelete']=true;
                scs.classDetails=[];
                return true;
            }
        });
        const filteredCTM = classTeacherMapCopy.filter((sdm) => {
            if (sdm.checked) {
                delete sdm['checked'];
                return true;
            } else {
                sdm['isDelete']=true;
                delete sdm['checked'];
                return true;
            }
        });
        this.staffMgmtService.assignSubject(filteredCSM, this.staffDetail.staffID, filteredCTM)
        .subscribe(
            isUpdated => {
                if (isUpdated) {
                    this.modalReference.dismiss('Manually');
                    this.toastr.success('Class and subject assigned successfully');
                    this.assign.emit('Staff added successfully');
                } else {
                    this.toastr.error('Class and subject assigned failed, Please try again later');
                }
            },
            error => {
                const errorData = this.auth.handleResponse(error);
                if (errorData) {
                    this.toastr.error('Class and subject assigned failed, Please try again later');
                    this.loading = false;
                } else {
                    this.toastr.error('Session expired, Please login');
                    this.modalReference.dismiss('Manually');
                }
            },
        );
    }

}

function newFunction(): string {
    return '<app-staff-subject-mapping>';
}

