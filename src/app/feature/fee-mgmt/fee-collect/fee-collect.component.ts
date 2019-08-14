 import { StudentMgmtService } from '../../../helpers/services/studentMgmt.service';
import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '../../../helpers/services/pagination.service';
import { AlertService, LoginUserService, SchoolMgmtService, FeeService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import * as _ from 'underscore';
import { InstituteService, ReportsService } from '../../../helpers/services/service';
import { StudentFilterPipe } from '../../../helpers/filters/filter';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UploadService } from '../../../helpers/services/upload-file.service';
import { Util } from '../../../helpers/util'; 
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-fee-collect',
  templateUrl: './fee-collect.component.html',
  styleUrls: ['./fee-collect.component.scss'],
  // styles: ['.custom {color : blue}'],
})

export class FeeCollectComponent implements OnInit {
  model: any = {
    selectedClass: null
  };
  loading = false;
  message: string;
  classes: any = [];
  students: any
  fees: any = [];
  feePayments: any =[];
  selectedClass: any;
  selectedStudent: any;
  titleText: string;
  modalReference: any;
  closeResult: string;
  MOP=['Cash','Check','DD','Deposit']
  fee: any;
  feeTransactions: any;


  constructor(
    private alert: AlertService,
    private auth: LoginUserService,
    private schoolService: SchoolMgmtService,
    private reportsService: ReportsService,
    private modalService: NgbModal,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    public util: Util,
    private feeService: FeeService,
  ) {    
    this.toastr.setRootViewContainerRef(vcr);    
    this.getDropDownValues();
  }

  ngOnInit() {
      const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
      this.getSchoolClassDetails(schoolId,false);
  }

  getSelectedDDValues() {
    return {
      classID: this.model.selectedClass.classID,
      schoolID: this.auth.getSchoolID()
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
    if (!this.classes) {
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
          this.auth._schoolDetail = schoolDetail;
          this.auth.classDetail = schoolDetail.classDetails;
          this.classes = this.auth.classDetail;
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

  onChangeClass(event) {
    this.model.selectedClass = null;
    this.model.selectedStudent = null;
    this.model.selectedClass = event
    const detail = this.auth.schoolDetail;
    this.getAllStudents();    
    this.fees=[];
    console.log('selected class', event, this.students)
  }

  getAllStudents() {
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    this.feeService.getStudents({schoolId:schoolId, classId:this.model.selectedClass.classID})
    .subscribe(
        students => {
            if (students) {
                this.students = students.sort(function(a, b) {
                    return (a.createdDate < b.createdDate) ? 1 : ((b.createdDate < a.createdDate) ? -1 : 0);
                });
                // this.setPage(1, this.students);
                // if (this.selectedClassObj && Object.keys(this.selectedClassObj).length > 0) {
                //     this.filterStudent();
                // }
            } else {
            }
        },
    );
  }

  onChangeStudent(event) {
    this.model.selectedStudent = event
    console.log('selected Student', event);
    this.fees=[];
    this.feePayments=[];
    this.getAssignedFeesStudentwise();
    this.getStudentFeePayments();
  }

  getAssignedFeesStudentwise() {
    this.feeService.getAssignedFeesStudentwise(this.model.selectedStudent.studentRollNo)
        .subscribe(
        fees => {
            if (fees) {
                this.fees = fees;
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
  getStudentFeePayments() {
    this.feeService.getStudentFeePayments(this.model.selectedStudent.studentRollNo)
        .subscribe(
        feePayments => {
            if (feePayments) {
                this.feePayments = feePayments;
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
  openCollectFee(content) {     
        let cls=this.model.selectedClass;
        let stu=this.model.selectedStudent;
        this.model={};
        this.model.collection=[];
        this.model.modeOfPayment=null;
        this.model.selectedClass=cls;
        this.model.selectedStudent=stu;
        this.model.collection=this.fees.filter((fee)=>{return fee.checked==true && fee.paymentStatus=='u';});
        this.model.collection.map((fee)=>{fee.amountToPay=(fee.balance==null?fee.amount:fee.balance)});
        // this.model.amount=this.model.collection.filter((a,b)=>{return a.amountToPay+b});
        // this.model.amount = _.reduce(this.model.collection, function(memo, num){ return memo + num.amountToPay; });
        let sum=0;
        this.model.collection.forEach(function(obj){
            sum=sum+obj.amountToPay;
        })
        this.model.amount=sum;
        this.titleText="Collect Fee";
        if(this.model.collection && this.model.collection.length){
            this.modalReference = this.modalService.open(content, { size: 'lg' });
            this.modalReference.result.then((result) => {
                this.resetModelAndMessage();
                this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }
    }
    private getDismissReason(reason: any): string {
        this.fees.map((fee)=>{fee.checked=false;});
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
        this.model.collection = {};
        this.message = '';
    }
    calculateTotalAmount(){
        let sum=0;
        this.model.collection.forEach(function(obj){
            sum=sum+obj.amountToPay;
        })
        this.model.amount=sum;
    }

    collectFee() {
        this.model.schoolID = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
        const instituteID = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
        this.model.referenceNo=this.model.referenceNo?this.model.referenceNo:'';
        this.feeService.collectFee(this.model)
        .subscribe(
        data => {
            if (!data.error) {
                this.getStudentFeePayments();
                this.getAssignedFeesStudentwise();
                this.resetModelAndMessage();
                this.modalReference.dismiss('Manually');
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

    getTotal(fees){
        let sum=0;
        fees.forEach(function(obj){
            sum=sum+obj.amount;
        })
        return sum;
    }

    getPaid(fees){
        let sum=0;
        fees.forEach(function(obj){
            sum=sum+obj.paidAmount;
        })
        return sum;
    }

    getDiscount(fees){
        let sum=0;
        fees.forEach(function(obj){
            sum=sum+obj.discount;
        })
        return sum;
    }

    getBalance(fees){
        let sum=0;
        fees.forEach(function(obj){
            sum=sum+(obj.balance!=null?obj.balance:obj.amount);
        })
        return sum;
    }

  openReceipt(content, fee) {     
      this.fee=fee;
      this.fee.today=new Date();
      this.fee.amountInWords=this.convertNumberToWords(fee.totalAmount);
      this.getStudentFeeTransactions(fee.receiptNo)
      this.modalReference = this.modalService.open(content, { size: 'lg' });
      this.modalReference.result.then((result) => {
          this.resetModelAndMessage();
          this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  getStudentFeeTransactions(receiptNo) {
    this.feeService.getStudentFeeTransactions(receiptNo)
        .subscribe(
        feeTransactions => {
            if (feeTransactions) {
                this.feeTransactions = feeTransactions;
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

  convertNumberToWords(amount) {
        var words = new Array();
        words[0] = '';
        words[1] = 'One';
        words[2] = 'Two';
        words[3] = 'Three';
        words[4] = 'Four';
        words[5] = 'Five';
        words[6] = 'Six';
        words[7] = 'Seven';
        words[8] = 'Eight';
        words[9] = 'Nine';
        words[10] = 'Ten';
        words[11] = 'Eleven';
        words[12] = 'Twelve';
        words[13] = 'Thirteen';
        words[14] = 'Fourteen';
        words[15] = 'Fifteen';
        words[16] = 'Sixteen';
        words[17] = 'Seventeen';
        words[18] = 'Eighteen';
        words[19] = 'Nineteen';
        words[20] = 'Twenty';
        words[30] = 'Thirty';
        words[40] = 'Forty';
        words[50] = 'Fifty';
        words[60] = 'Sixty';
        words[70] = 'Seventy';
        words[80] = 'Eighty';
        words[90] = 'Ninety';
        amount = amount.toString();
        var atemp = amount.split(".");
        var number = atemp[0].split(",").join("");
        var n_length = number.length;
        var words_string = "";
    
         if (n_length <= 9) {
            var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
            var received_n_array = new Array();
            for (var i = 0; i < n_length; i++) {
                received_n_array[i] = number.substr(i, 1);
            }
            for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
                n_array[i] = received_n_array[j];
            }
            for (var i = 0, j = 1; i < 9; i++, j++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    if (n_array[i] == 1) {
                        n_array[j] = 10 + n_array[j];
                        n_array[i] = 0;
                    }
                }
            }
            var value;
            for (var i = 0; i < 9; i++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    value = n_array[i] * 10;
                } else {
                    value = n_array[i];
                }
                if (value != 0) {
                    words_string += words[value] + " ";
                }
                if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Crores ";
                }
                if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Lakhs ";
                }
                if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Thousand ";
                }
                if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                    words_string += "Hundred and ";
                } else if (i == 6 && value != 0) {
                    words_string += "Hundred ";
                }
            }
            words_string = words_string.split("  ").join(" ");
        }
             return words_string;
    }
}
