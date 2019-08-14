import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoginUserService, AlertService, MarksMgmtService, SchoolMgmtService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';

import { filter } from 'rxjs/operator/filter';

@Component({
  selector: 'app-halltickets-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  model: any = {
    selectedClass: null
  };
  loading = false;
  message: string;
  classes: any = [];
  students: any;
  terms: any = [];
  subjects: any = [];
  classID: any;
  selectedClass: any;
  selectedTerm: any;
  modalReference: any;
  classMode: any;
  hallTicketDetails: any = [];
  allStudents: any;
  titleText: string;
  req: any;
  closeResult: string;

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
  }

  onChangeTerm(event) {
    this.model.selectedTerm = event;
    this.classes = this.auth.classDetail;
    console.log(this.classes);
    if (!this.classes) {
      const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
      this.getSchoolClassDetails(schoolId);
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

  openModelWithDetail(model, data) {
    //this.subjectDetails = data.subjectDetails;
    this.classID = data.classID;
    this.titleText=this.model.selectedTerm.termName+" - "+data.className;
    this.getHallTicket(data);
    this.modalReference = this.modalService.open(model, { size: 'lg' });
    // this.modalReference.result.then((result) => {
    //     this.resetModelAndMessage();
    //     this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //     this.resetModelAndMessage();
    //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }

  resetModelAndMessage() {
      this.model = {};
      this.message = '';
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

  getRequestObj() {
      this.req = {};
      this.req.schoolID = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
      this.req.instituteID = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
      this.req.updatedBy = this.auth.userId();
      this.req.subjectDetails = this.hallTicketDetails;
      this.req.termInstituteID = this.model.selectedTerm.termInstituteID;
      this.req.classID = this.classID;
      return this.req;
  }

  submitHTSetup(){
    const req = this.getRequestObj();
    this.marksService.setupHllTickets(req)
      .subscribe(
      data => {
        if (!data.error) {
            this.modalReference.dismiss('Manually');
            this.toastr.success('Hallticket setup done successfully');
            //this.add.emit('Images added successfully');
        } else {
            this.message = data.error;
            this.loading = false;
        }
      },
      error => {
      },
    );
  }

  getHallTicket(data) {
    this.req={};
    this.req.schoolID = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    this.req.termInstituteID = this.model.selectedTerm.termInstituteID;
    this.req.classID = this.classID;
    this.marksService.getHallTicket(this.req)
      .subscribe(
      hallTickets => {
        if (hallTickets) {          
          this.hallTicketDetails = [];
          var ss=[];
          console.log(hallTickets);
          if(hallTickets.length>0 && hallTickets[0]){
            if(hallTickets[0].classID==data.classID){
              data.subjectDetails.forEach(function(tt){
                var consists=false;
                hallTickets[0].subjectDetails.forEach(function(it){
                  if(tt.subjectID==it.subjectID){
                    consists=true;
                    var dt=it.examDate.split('/');
                    var dd={
                      day:parseInt(dt[0]),
                      month:parseInt(dt[1]),
                      year:parseInt(dt[2])
                    }
                    it.examDate=dd;
                  }
                });
                if(!consists){
                  tt.examDate=null;
                  tt.startTime=null;
                  tt.endTime=null;
                  hallTickets[0].subjectDetails.push(tt);
                }
              });
              ss=hallTickets[0].subjectDetails;
            this.hallTicketDetails=ss;
            }
          }
          else{
            this.hallTicketDetails=data.subjectDetails;
          }
        } else {
              this.hallTicketDetails=data.subjectDetails;
        }
      },
      error => {
        this.message = data.error;
        this.loading = false;
      },
    );
  }
}
