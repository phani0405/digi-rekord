import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoginUserService, AlertService, MarksMgmtService, SchoolMgmtService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';

import { filter } from 'rxjs/operator/filter';

@Component({
  selector: 'app-marks-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss']
})
export class MarksDivisionComponent implements OnInit {
  model: any = {
    selectedClass: null
  };
  loading = false;
  message: string;
  classes: any = [];
  students: any
  terms: any = [];
  subjects: any = [];
  selectedClass: any;
  selectedTerm: any;
  sdTypes: any = ['Grades', 'Marks']
  subjectDivisions: any;
  titleText: string;
  modalReference: any;
  classMode: any;
  selectedSubjectDivision: any;
  allStudents: any;

  constructor(
    private alert: AlertService,
    private auth: LoginUserService,
    private marksService: MarksMgmtService,
    private schoolService: SchoolMgmtService,
    private modalService: NgbModal,
    public toastr: ToastsManager, vcr: ViewContainerRef,
  ) {
    this.toastr.setRootViewContainerRef(vcr)
    this.getDropDownValues();
  }

  ngOnInit() {
    this.getAllSubjectDivision();
  }

  parseDivisionForModel(subjectDivision) {
    const sd = Object.assign([], subjectDivision)
    const allSD = []
    for (let x = 0; x < sd.length; x++) {
      const el = sd[x]
      if (el.classes) {
        for (let i = 0; i < el.classes.length; i++) {
          const classData = el.classes[i]
          if (classData && classData.subjects) {
            for (let j = 0; j < classData.subjects.length; j++) {              
              const subjectData = classData.subjects[j]
              for(let y=0; y< subjectData.subjectDivisions.length; y++) {
                el.className = classData.className
                el.classID = classData.classID
                el.subjectName = subjectData.subjectName
                el.subjectID = subjectData.subjectID
                const subjectDiv = subjectData.subjectDivisions[y];
                console.log("subjectDiv", subjectDiv)
                if(subjectDiv) {
                  el.subjectDivisions = subjectDiv
                  allSD.push(Object.assign({}, el))
                }
              }
            }
          }
        }
      }
      delete el['classes']
    }
    return allSD;
  }

  getAllSubjectDivision() {
    const schoolID = this.auth.getSchoolID()
    this.marksService.getStudentsForDivision(schoolID)
      .subscribe(
      schoolDetail => {
        if (schoolDetail) {
          console.log('schoolDetail', schoolDetail)
          this.allStudents = this.parseDivisionForModel(schoolDetail);
          this.filterStudentOnChange()
        } else {
        } 
      },
      error => {
      },
    )
  }

  getDropDownValues() {
    if (this.auth.userRole().toLowerCase() === 'schooladmin') {
      this.getDDValuesForPrincipalAndSchoolAdmin();
    }
    if (this.auth.userRole().toLowerCase() === 'teachingstaff') {
      this.getDropDownValuesForTeachingStaff();
    }
  }

  getDDValuesForPrincipalAndSchoolAdmin() {
    this.classes = this.auth.classDetail
    this.terms = this.auth.termDetail
    if (!this.classes || !this.terms) {
      const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
      this.getSchoolClassDetails(schoolId);
    }
  }

  getDropDownValuesForTeachingStaff() {
    const detail = this.auth.registeredDetails();
    const role = detail && detail[0] &&
      detail[0].staffRole ? detail[0].staffRole.toLocaleLowerCase() : '';
    switch (role) {
      case 'principal':
        this.getDDValuesForPrincipalAndSchoolAdmin();
        break;
      case 'staff':
        this.getSchoolClassDetails(detail[0] && detail[0].schoolID, true)
        break;
    }
  }

  updateClassDetailsForStaff() {
    const detail = this.auth.registeredDetails();
    this.auth.classDetail = detail && detail[0] && detail[0].classTeacherDetails;
    this.classes = this.auth.classDetail;
  }

  getSchoolClassDetails(schoolId, isClassUpdate?: boolean) {
    this.schoolService.getSchoolDetail(schoolId)
      .subscribe(
      schoolDetail => {
        if (schoolDetail) {
          this.auth.schoolDetail = schoolDetail;
          this.auth.classDetail = schoolDetail.classDetails;
          this.auth.termDetail = schoolDetail.termDetails;
          this.classes = this.auth.classDetail;
          this.terms = this.auth.termDetail;
          if (isClassUpdate) {
            this.updateClassDetailsForStaff();
          }
        } else {
        }
      },
      error => {
      },
    );
  }

  filterStudentOnChange() {
    if(this.model.selectedTerm) {
      this.students = this.allStudents.filter((e => {
        return e.termInstituteID === this.model.selectedTerm.termInstituteID
      }))
    }
    if(this.model.selectedClass) {
      this.students = this.allStudents.filter((e => {
        return e.classID === this.model.selectedClass.classID
      }))
    }
    if(this.model.selectedSubject) {
      this.students = this.allStudents.filter((e => {
        return e.subjectID === this.model.selectedSubject.subjectID
      }))
    }
    if(this.model.selectedTerm && this.model.selectedClass) {
      this.students = this.allStudents.filter((e => {
        return e.termInstituteID === this.model.selectedTerm.termInstituteID &&
        e.classID === this.model.selectedClass.classID
      }))
    }
    if(this.model.selectedTerm && this.model.selectedClass && this.model.selectedSubject) {
      this.students = this.allStudents.filter((e => {
        return e.termInstituteID === this.model.selectedTerm.termInstituteID &&
               e.classID === this.model.selectedClass.classID && 
               e.subjectID === this.model.selectedSubject.subjectID
      }))
    }
  }

  onChangeClass(event) {
    this.model.selectedClass = event
    const detail = this.auth.schoolDetail;
    this.subjects = event.subjectDetails;
    if (!this.subjects) {
      const classDetail = detail.classDetails.find((el => {
        return el.classID === event.classID;
      }));
      this.subjects = classDetail.subjectDetails;
    }
    this.filterStudentOnChange()
    console.log('selected class', event, this.subjects)
  }

  onChangeTerm(event) {
    this.model.selectedTerm = event
    this.filterStudentOnChange()
    console.log('selected term', event)
  }

  onChangeSubject(event) {
    this.model.selectedSubject = event
    this.filterStudentOnChange()
    console.log('selected subject', event)
  }

  getSubjectDivisionForModel(subjectDivision) {
    const sd = Object.assign({}, subjectDivision)
    if (sd.grades && typeof (sd.grades) !== 'string') {
      sd.grades = sd.grades.join(',')
    }
    return sd;
  }

  openSubDivisionModel(content, selectedModel) {
    console.log('Selected ', selectedModel)
    this.selectedSubjectDivision = selectedModel;
    this.subjectDivisions = selectedModel ? this.getSubjectDivisionForModel(selectedModel.subjectDivisions) : {};
    this.titleText = selectedModel ? 'Edit Subject Division' : 'Add Subject Division';
    this.classMode = selectedModel ? 'edit' : 'add';
    this.modalReference = this.modalService.open(content, { size: 'lg' });
    this.modalReference.result.then((result) => {
      this.message = '';
      this.subjectDivisions = {};
    }, (reason) => {
      this.message = '';
      this.subjectDivisions = {};
    });
  }

  submitSubDivision() {
    if (this.classMode === 'add') {
      this.addSubjectDivision();
    } else {
      this.updateSubjectDivision();
    }
  }

  getSubjectDivisionForRequest() {
    const sd = this.subjectDivisions;
    if (sd.subjectDivisionType === 'Marks' && sd.grades) {
      delete sd['grades']
    }
    if (sd.subjectDivisionType === 'Grades' && typeof (sd.grades) === 'string') {
      delete sd['minMarks']
      delete sd['maxMarks']
      sd.grades = sd.grades.split(',')
    }
    return sd;
  }

  getRequestObjectForAdd() {
    const schoolDetail = this.auth.schoolDetail;
    return {
      'schoolID': schoolDetail.schoolID,
      'instituteID': schoolDetail.instituteID,
      'termInstituteID': this.model.selectedTerm && this.model.selectedTerm.termInstituteID,
      'termName': this.model.selectedTerm && this.model.selectedTerm.termName,
      'createdBy': this.auth.userId(),
      'classID': this.model.selectedTerm && this.model.selectedClass.classID,
      'className': this.model.selectedTerm && this.model.selectedClass.className,
      'subjectID': this.model.selectedTerm && this.model.selectedSubject.subjectID,
      'subjectName': this.model.selectedTerm && this.model.selectedSubject.subjectName,
      'subjectDivisions': this.getSubjectDivisionForRequest()
    }
  }

  getRequestObjectForUpdate() {
    const sd = Object.assign({}, this.selectedSubjectDivision)
    sd.subjectDivisions = this.getSubjectDivisionForRequest();
    return sd;
  }

  addSubjectDivision() {
    this.marksService.addDivision(this.getRequestObjectForAdd())
      .subscribe(
      response => {
        if (!response.error) {
          this.toastr.success('Subject Division added successfully');
          // refresh the list
          this.getAllSubjectDivision();
          this.modalReference.dismiss('Manually');
        } else {
          this.toastr.error(response.error);
        }

      },
      error => {
        this.toastr.error('Unable to add, Please try again later...');
      },
    );
  }

  updateSubjectDivision() {
    this.marksService.updateDivision(this.getRequestObjectForUpdate())
      .subscribe(
      response => {
        if (!response.error) {
          this.toastr.success('Subject Division updated successfully');
          // refresh the list
          this.getAllSubjectDivision();
          this.modalReference.dismiss('Manually');
        } else {
          this.toastr.error(response.error);
        }
      },
      error => {
        this.toastr.error('Unable to update, Please try again later...');
      },
    );
  }

  openModelWithDetail(model, data) {
    this.selectedSubjectDivision = data;
    this.modalService.open(model, { size: 'lg' });
  }

  openDeleteDivisionModel(model, selectedDivision) {
    this.selectedSubjectDivision = selectedDivision;
    this.modalReference = this.modalService.open(model, { size: 'lg' });
  }

  deleteSubjectDivision(selectedDivision) {
    const data = {
      termID: selectedDivision.termID,
      classID: selectedDivision.classID,
      subjectID: selectedDivision.subjectID,
      subjectDivisionID: selectedDivision.subjectDivisions.subjectDivisionID,
      updatedBy: this.auth.userId()
    }
    console.log("req data", data)
    this.marksService.deleteDivision(data)
      .subscribe(
      response => {
        if (!response.error) {
          this.toastr.success('Subject Division delete successfully');
          // refresh the list
          this.getAllSubjectDivision();
          this.modalReference.dismiss('Manually');
        } else {
          this.toastr.error(response.error);
        }
      },
      error => {
        this.toastr.error('Unable to delete, Please try again later...');
      },
    );
  }
}
