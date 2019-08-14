import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONFIG } from './../../../../app.constant';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { InstituteService, AlertService, LoginUserService, SchoolMgmtService, FeeService, TimelineMgmtService } from '../../../../helpers/services/service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
// import { CustomValidators } from '../../../helpers/validators/custom.validators.service';

@Component({
    moduleId: module.id,
    selector: 'fee-setup-assign',
    templateUrl: './assign.component.html',
    styleUrls: ['./assign.component.scss'],
    providers: [AlertService],
})
export class FeeSetupAssignComponent implements OnInit {
    @Input() mode: string;
    @Input() fee:any;
    @ViewChild('assign') modalRef: ElementRef;    
    @Output() assign: EventEmitter<any> = new EventEmitter();
    model: any = {};
    loading = false;
    modalReference: any;
    closeResult: string;
    message: string;
    states: any;
    allFeatures: any
    timeZones: any
    selectedClassObj: any;
    selectedUserClass: any;
    classes: any;
    students: any;


    onlyNumberKey(event) {
        return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
    }
    onlyAlphabetKey(event) {
        return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123);
    }
    ngOnInit() {
        this.getSchoolClassDetails();
    }
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private instituteService: InstituteService,
        private alertService: AlertService,
        private auth: LoginUserService,
        private schoolMgmt: SchoolMgmtService,
        public toastr: ToastsManager, vcr: ViewContainerRef,
        private schoolService: SchoolMgmtService,
        private feeService: FeeService,
        private timelineService: TimelineMgmtService
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    open(content, fee) {        
        this.classes=[];
        this.model=fee;
        this.getAssignedFeesClasswise();
        this.modalReference = this.modalService.open(content, { size: 'lg' });
        this.modalReference.result.then((result) => {
            this.resetModelAndMessage();
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdp';
        } else {
            this.resetModelAndMessage();
            return `with: ${reason}`;
        }
    }

    resetModelAndMessage() {
        this.model = {};
        this.message = '';
    }

    onChangeClass(event: any, query: string) {
        if (query === 'update') {
            this.selectedUserClass = event;
        }
         if (query === 'filter') {
            this.selectedClassObj = event;
         }
    }

    getSchoolClassDetails() {
        const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
        this.schoolService.getSchoolDetail(schoolId)
        .subscribe(
            schoolDetail => {
                if (schoolDetail) {
                    this.auth.schoolDetail = schoolDetail;
                    this.auth.classDetail = JSON.parse(JSON.stringify(schoolDetail.classDetails));
                    this.classes = JSON.parse(JSON.stringify(schoolDetail.classDetails));
                    // this.classesForSort = schoolDetail.classDetails;
                    // this.classesForSort.unshift({className: 'All', classID: 'All'});
                    // this.selectedClassObj = this.classesForSort[0];
                } else {
                }
            },
            error => {
            },
        );
    }

    // getAllStudents() {
    //     const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    //     this.studentService.getStudents(schoolId)
    //     .subscribe(
    //         students => {
    //             if (students) {
    //                 this.students=students;
    //             } else {
    //             }
    //         },
    //     );
    // }

    // getClassStudents() {
    //     console.log(this.auth.registeredDetails());
    //     var paramObj = { key: 'staffID', value: '' };

    //     paramObj.value = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].staffID : '';
    //     if (!paramObj.value) {
    //         paramObj.value = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    //         paramObj.key = "schoolID";
    //     }
    //     this.timelineService.getClassStudents(paramObj)
    //         .subscribe(
    //         classes => {
    //             if (classes) {
    //                 this.classes = JSON.parse(JSON.stringify(classes));
    //             } else {
    //             }
    //         },
    //         error => {

    //         });
    // }

    selectAll(cs) {
        cs.students.map((st) => st.checked=true);
    }
    resetAll(cs) {
        cs.students.map((st) => st.checked=false);
    }

    getAssignedFeesClasswise() {
        this.feeService.getAssignedFeesClasswise(this.model.feeID)
            .subscribe(
            classes => {
                if (classes) {
                    this.classes = classes;
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

    assignFee() {
        this.model.schoolID = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
        const instituteID = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
        var studentIDs = [];        
        var classes = Object.assign([], this.classes);
        classes.forEach(element => {
            var studentIds = element.students.filter((student) => { return student.checked }).map((std) => std.studentRollNo);
            console.log("each class selected student", studentIds);
            studentIDs.push(...studentIds);
        });
        this.model.studentIDs = studentIDs;
        this.model.classes = this.classes;
        this.feeService.assignFeesClasswise(this.model)
        .subscribe(
        data => {
            if (!data.error) {
                this.resetModelAndMessage();
                this.modalReference.dismiss('Manually');
                this.assign.emit('Fee assigned successfully');
            } else {
                this.message = data.error;
                this.loading = false;
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
        });
    }
}
