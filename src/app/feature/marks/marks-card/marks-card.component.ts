import { Component, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { LoginUserService, AlertService, MarksMgmtService, SchoolMgmtService, StudentMgmtService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operator/filter';

@Component({
  selector: 'app-marks-card',
  templateUrl: './marks-card.component.html',
  styleUrls: ['./marks-card.component.scss']
})
export class MarksCardComponent implements OnInit {
  model: any = {
    selectedClass: null
  };
  loading = false;
  modalReference: any;
  closeResult: string;
  message: string;
  classes: any = [];
  students: any;
  terms: any;
  allStudents: any;
  registeredDetails: any
  studentDetails: any
  marksReport: any

  constructor(
    private alert: AlertService,
    private auth: LoginUserService,
    private modalService: NgbModal,
    private marksService: MarksMgmtService,
    private schoolService: SchoolMgmtService,
    private studentService: StudentMgmtService
  ) {
    this.getDropDownValues();
  }

  ngOnInit() {
    this.getAllStudents();
    this.registeredDetails = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0] : '';
  }

  open(content,termValue,student) {
      console.log(student);
      this.studentDetails=student;
      this.getAllSubjectDivision(student.studentID, termValue);
      this.modalReference = this.modalService.open(content, { size: 'lg' });
      this.modalReference.result.then((result) => {
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
          return `with: ${reason}`;
      }
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
          this.auth.classDetail = schoolDetail.classDetails;
          this.auth.termDetail = schoolDetail.termDetails;
          this.classes = this.auth.classDetail;
          this.terms = this.auth.termDetail;
          if(isClassUpdate) {
            this.updateClassDetailsForStaff();
          }
        } else {
        }
      },
      error => {
      },
    );
  }

  onChangeClass(event) {
    this.model.selectedClass = event
    this.students = this.allStudents.filter((e) => {
      return event.classID === e.classID
    })
    console.log("selected class", event)
  }

  getAllStudents() {
    const schoolId = this.auth.getSchoolID();
    this.studentService.getStudents(schoolId)
    .subscribe(
        students => {
            if (students) {
                this.allStudents = students;
                this.students = students.sort(function(a, b) {
                    return (a.createdDate < b.createdDate) ? 1 : ((b.createdDate < a.createdDate) ? -1 : 0);
                });
            } else {
            }
        },
    );
  }

  getAllSubjectDivision(sID, tID) {
    this.marksService.studentMarksReport(sID)
      .subscribe(
      marksReport => {
        console.log(marksReport);
        this.marksReport=marksReport;
      },
      error => {
      },
    )
  }
  getTotal(sds) {
    let total = 0;
    for (var i = 0; i < sds.length; i++) {
        if (sds[i].obtainedMarks) {
            total += sds[i].obtainedMarks;
        }
    }
    return total;
  }
  getFinalTotal(sds) {
    let total = 0;
    for (var i = 0; i < sds.length; i++) {
      for (var j = 0; j < sds[i].subjectDivisions.length; j++) {
        if (sds[i].subjectDivisions[j].obtainedMarks) {
            total += sds[i].subjectDivisions[j].obtainedMarks;
        }
      }
    }
    return total;
  }
  getFinalPercentage(sds) {
    let total = 0;
    for (var i = 0; i < sds.length; i++) {
        if (sds[i].obtainedMarks) {
            total += sds[i].obtainedMarks;
        }
    }
    return total;
  }
}
