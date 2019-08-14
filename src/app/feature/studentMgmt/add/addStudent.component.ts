import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONFIG } from './../../../app.constant';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { StudentMgmtService, AlertService, LoginUserService } from '../../../helpers/services/service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Upload } from '../../../helpers/models/upload-file.models';
import { UploadService } from '../../../helpers/services/upload-file.service';
import { Util } from '../../../helpers/util'; 

@Component({
    selector: 'app-add-student',
    templateUrl: './addStudent.component.html',
    styleUrls: ['./addStudent.component.scss'],
    providers: [AlertService],
})
export class AddStudentComponent implements OnInit {
    @Input() mode: string;
    @Output() add: EventEmitter<any> = new EventEmitter();
    model: any = {
        gender: '',
        studentClass: null,
    };
    loading = false;
    modalReference: any;
    closeResult: string;
    message: string;
    classes: any;
    userExists: boolean;
    userFExists: boolean;
    userMExists: boolean;
    currentUpload: Upload;
    uploadingImageLoading: any;


    genders = [
        { value: 'Male', display: 'Male' },
        { value: 'Female', display: 'Female' },
    ];

    ngOnInit() {
        this.model.gender = this.genders[0].value;
    }
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private studentService: StudentMgmtService,
        private alertService: AlertService,
        private auth: LoginUserService,
        public toastr: ToastsManager, vcr: ViewContainerRef,
        private upSvc: UploadService,
        public util: Util,
    ) {
        this.toastr.setRootViewContainerRef(vcr);
     }

    open(content) {
        this.classes = this.auth.classDetail;
        this.modalReference = this.modalService.open(content, {size : 'lg'});
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
            return  `with: ${reason}`;
        }
    }

    resetModelAndMessage() { 
        this.model = {}; 
        this.message = ''; 
    } 

    checkUserId(enteredValue : string ) {  
        console.log(enteredValue);
        this.studentService.checkUserExists(enteredValue)
        .subscribe(
        data => {
            if (data) {
                this.userExists = data.userExists;
            } else {
            }
        });
    }
    checkFatherUserId(enteredValue : string ) {  
        console.log(enteredValue);
        this.studentService.checkUserExists(enteredValue)
        .subscribe(
        data => {
            if (data) {
                this.userFExists = data.userExists;
            } else {
            }
        });
    }
    checkMotherUserId(enteredValue : string ) {  
        console.log(enteredValue);
        this.studentService.checkUserExists(enteredValue)
        .subscribe(
        data => {
            if (data) {
                this.userMExists = data.userExists;
            } else {
            }
        });
    }

    addStudent(content) {
        this.message = '';
        const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
        const instituteID = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
        const schoolName = this.auth.schoolDetail ? this.auth.schoolDetail.schoolName : '';
        const studentClass = this.classes.filter(item => {
            if (item.classID === this.model.studentClass) {
                delete item['subjectDetails'];
                return true;
            } else {
                return false;
            }
        })[0];

        console.log('studentClass' ,studentClass);
        console.log('classes' ,this.classes);
        if (studentClass) {
            this.model.className = studentClass.className;
            this.model.classID = studentClass.classID;
        }
        this.studentService.create(this.model, schoolId, schoolName, instituteID)
        .subscribe(
            data => {
                if (!data.error) {
                    this.toastr.success('Student created successfully');
                    this.modalReference.dismiss('Manually');
                    this.add.emit('Student added successfully');
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
                        this.uploadingImageLoading = false;
                        const upload: any = success;
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
}
