import { StudentMgmtService } from '../../../helpers/services/studentMgmt.service';
import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '../../../helpers/services/pagination.service';
import { AlertService, LoginUserService, SchoolMgmtService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import * as _ from 'underscore';
import { InstituteService } from '../../../helpers/services/service';
import { StudentFilterPipe } from '../../../helpers/filters/filter';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Upload } from '../../../helpers/models/upload-file.models';
import { UploadService } from '../../../helpers/services/upload-file.service';
import { Util } from '../../../helpers/util'; 

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
  // styles: ['.custom {color : blue}'],
})

export class StudentListComponent implements OnInit {
  _router: Router;
  listFilter= '';
  students: any;
  studentDetail: any;
  selectedStudentDetail: any;
  pager: any = {};
  pagedItems: any[];
  modalReference: any;
  closeResult: string;
  url: string;
  model: any = {
  };
  loading = false;
  message: string;
  genders = [
    { value: 'Male', display: 'Male' },
    { value: 'Female', display: 'Female' },
  ];
  classes: any;
  selectedUserClass: any;
  classesForSort: any;
  selectedClassObj: any;
  currentUpload: Upload;
  uploadingImageLoading: any;
  deleteModelReference : any;
  searchText: string;
  showFees: Boolean = false;
  showTimeline: Boolean = false;
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private alertService: AlertService,
        private pagerService: PagerService,
        private auth: LoginUserService,
        private schoolService: SchoolMgmtService,
        private studentService: StudentMgmtService,
        public toastr: ToastsManager, vcr: ViewContainerRef,
        private upSvc: UploadService,
        public util: Util,
    ) {
        this.toastr.setRootViewContainerRef(vcr);
     }

    ngOnInit() {
        this.getAllStudents();
        this.getSchoolClassDetails();
        let features=this.auth.features();
        var fexists=features.find(x => x.featureID == 'DiGiF17' && x.selected == true);
        if(fexists){
            this.showFees=true;
        }
        var texists=features.find(x => x.featureID == 'DiGiF07' && x.selected == true);
        if(texists){
            this.showTimeline=true;
        }
    }

    getAllStudents() {
        const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
        this.studentService.getStudents(schoolId)
        .subscribe(
            students => {
                if (students) {
                    this.students = students.sort(function(a, b) {
                        return (a.createdDate < b.createdDate) ? 1 : ((b.createdDate < a.createdDate) ? -1 : 0);
                    });
                    this.setPage(1, this.students);
                    if (this.selectedClassObj && Object.keys(this.selectedClassObj).length > 0) {
                        this.filterStudent();
                    }
                } else {
                }
            },
        );
    }

    deleteStudent(student){
        var data= {
            studentID: student.studentID,
            updatedBy:this.auth.userId()
        };
        this.studentService.deleteStudent(data)
        .subscribe(
            data => {
                if(!data.error) {
                    this.toastr.success('Student deleted successfully');
                    // refresh the list
                    this.deleteModelReference.dismiss('Manually'); 
                    this.getAllStudents();
                } else {
                  this.toastr.error(data.error);
                }
              },
              error => {
                this.toastr.error('Unable to delete student, Please try again later...');
            },
        );    
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
                    this.classesForSort = schoolDetail.classDetails;
                    this.classesForSort.unshift({className: 'All', classID: 'All'});
                    this.selectedClassObj = this.classesForSort[0];
                } else {
                }
            },
            error => {
            },
        );
    }

    openModelWithDetail(content, studentDetail) {
        this.studentService.getStudentDetail(studentDetail.studentID)
        .subscribe(
            student => {
                if (student) {
                    this.selectedStudentDetail = this.getModelObject(student[0]);
                    console.log("student Details :",this.selectedStudentDetail);
                    this.modalService.open(content, {size : 'lg'});
                } else {
                }
            },
            error => {
            },
        );
    }

    openDeleteModel(content, studentDetail) {
        this.selectedStudentDetail = studentDetail;
        this.deleteModelReference = this.modalService.open(content, {size : 'lg'});
    }

    setPage(page: number, students? : any) {

        students = students ? students : this.students
        if (page < 1 || page > this.pager.totalPages && (students.length < 0 )) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(students.length, page);
        // get current page of items
        this.pagedItems = students.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    open(content, selectedModel) {
        this.selectedUserClass = {
            className: selectedModel.className,
            classID: selectedModel.classID,
        };
        this.studentService.getStudentDetail(selectedModel.studentID)
        .subscribe(
            student => {
                if (student) {
                    this.model = this.getModelObject(student[0]);
                    this.modalReference = this.modalService.open(content, {size : 'lg'});
                    this.resetUpdateModelOnCLose();
                } else {
                }
            },
            error => {
                this.auth.handleResponse(error);
            },
        );
    }

    resetUpdateModelOnCLose() {
        this.modalReference.result.then((result) => {
            this.message = '';
            this.model = {};
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.message = '';
            this.model = {};
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    getGenderValue(selectedGender) {
        const genderValue = this.genders.filter((gender) =>  gender.value === selectedGender);
        return genderValue && genderValue.length > 0 ? genderValue[0].value : 'Male';

    }

    getModelObject(selectedModel) {
        console.log("inside get model object", selectedModel);
        const model = {
            userName: '',
            studentRollNo: '',
            studentID: '',
            url: '',
            gender: '',
            fatherParentID: '',
            fatherName: '',
            fatherID: '',
            fatherEmail: '',
            fatherMobile: '',
            motherParentID: '',
            motherName: '',
            motherID: '',
            motherEmail: '',
            motherMobile: '',
            schoolID: '',
            schoolName: '',
            instituteID: '',
            createdDate: '',
        };
        if (selectedModel.student) {
            model.userName = selectedModel.student.studentName;
            model.studentRollNo = selectedModel.student.studentRollNo;
            model.gender = this.getGenderValue(selectedModel.student.gender);
            model.schoolID = selectedModel.student.schoolID;
            model.schoolName = selectedModel.student.schoolName;
            model.instituteID = selectedModel.student.instituteID;
            model.createdDate = selectedModel.student.createdDate;
            model.studentID = selectedModel.student.studentID;
            model.url = selectedModel.student.photo;
        }
        if (selectedModel.father) {
            model.fatherName = selectedModel.father.parentName;
            model.fatherID = selectedModel.father.userID;
            model.fatherEmail = selectedModel.father.parentEmailID;
            model.fatherMobile =  selectedModel.father.parentMobile;
            model.fatherParentID =  selectedModel.father.parentID;
        }
        if (selectedModel.mother) {
            model.motherName = selectedModel.mother.parentName;
            model.motherID = selectedModel.mother.userID;
            model.motherEmail = selectedModel.mother.parentEmailID;
            model.motherMobile = selectedModel.mother.parentMobile;
            model.motherParentID = selectedModel.mother.parentID;
        }
        return model;
    }

    private getDismissReason(reason: any): string {
        this.message = '';
        this.model = {};
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdp';
        } else {
            return  `with: ${reason}`;
        }
    }

    updateStudent(content) {
        this.model.classID = this.selectedUserClass.classID;
        this.model.className = this.selectedUserClass.className;
        this.studentService.update(this.model)
        .subscribe(
            data => {
                if (!data.error) {
                    this.model = {};
                    this.message = '';
                    this.modalReference.dismiss('Manually');
                    this.getAllStudents();
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
            },
        );
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

    filterStudent() {
        let sCopy = JSON.parse(JSON.stringify(this.students));
        if (this.selectedClassObj && this.selectedClassObj.classID !== 'All') {
            sCopy = sCopy.filter(s => {
                if (s.classID === this.selectedClassObj.classID) {
                    return true;
                } else {
                    return false;
                }
            });
        }
        sCopy = sCopy.sort(function(a, b) {
            return (a.createdDate < b.createdDate) ? 1 : ((b.createdDate < a.createdDate) ? -1 : 0);
        });
        if (sCopy.length > 0) {
            this.setPage(1, sCopy);
        } else {
            this.pagedItems = sCopy;
        }
    }

    onChangeClass(event: any, query: string) {
        if (query === 'update') {
            this.selectedUserClass = event;
        }
         if (query === 'filter') {
            this.selectedClassObj = event;
            this.filterStudent();
         }
    }

    byId(item1, item2) {
        if (item1 && item2 && item1.classID && item2.classID) {
            return item1.classID === item2.classID;
        } else {
            return false;
        }
    }

}
