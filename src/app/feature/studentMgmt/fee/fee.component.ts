import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONFIG } from './../../../app.constant';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoginUserService, TimelineMgmtService, SchoolMgmtService, StudentMgmtService } from '../../../helpers/services/service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Util } from '../../../helpers/util';

@Component({
    selector: 'app-fee',
    templateUrl: './fee.component.html',
    styleUrls: ['./fee.component.scss']
})
export class FeeComponent implements OnInit {
    @Input() mode: string;
    @Input() student:any;
    @ViewChild('fee') modalRef: ElementRef;    
    @Output() fee: EventEmitter<any> = new EventEmitter();
    
    model: any = {};
    feePrint: any = {};
    studentModel: any = {};
    loading = false;
    modalReference: any;
    closeResult: string;
    settingsModalRef: any;
    userRole: string;
    obj: any = {};
    message: string;
    schoolName: string;
    schoolLogo: string;
    schoolAddress: any = {};

    ngAfterViewInit() {
        // this.composeModalRef=
        // console.log(this.modalRef);
    }
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private auth: LoginUserService,
        private studentService: StudentMgmtService,
        private timelineService: TimelineMgmtService,
        private _fb: FormBuilder,
        public toastr: ToastsManager, vcr: ViewContainerRef,
        public util: Util
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    open(content, student) {
        this.studentModel=student;
        this.model.studentID = student.studentID;
        if(student.totalFee && student.totalFee>0){
            this.model.totalFee = student.totalFee;
        }else{
            this.model.totalFee = 0;            
            this.message = 'Please setup Total Fee to add Transactions.' ;
            this.loading = false;
        }
        if(student.balanceFee && student.balanceFee>0){
            this.model.balanceFee = student.balanceFee;            
        }else{
            this.model.balanceFee = 0;
        }
        this.model.balanceFee = student.balanceFee;
        this.model.feeDetails = {};
        this.modalReference = this.modalService.open(this.modalRef, { size: 'lg' });
        this.modalReference.result.then((result) => {
            this.resetModelAndMessage();
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    print(fee): void {
        this.feePrint=fee;
        let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>Fee Receipt</title>
              <link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"> 
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izimodal/1.5.1/css/iziModal.min.css" />
              <style>
              #invoice-POS{
                  box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
                  padding:2mm;
                  margin: 0 auto;
                  width: 250mm;
                  background: #FFF;
                  
                  
                ::selection {background: #f31544; color: #FFF;}
                ::moz-selection {background: #f31544; color: #FFF;}
                h1{
                  font-size: 1.5em;
                  color: #222;
                }
                h2{font-size: .9em;}
                h3{
                  font-size: 1.2em;
                  font-weight: 300;
                  line-height: 2em;
                }
                p{
                  font-size: .7em;
                  color: #666;
                  line-height: 1.2em;
                }
                 
                #top, #mid,#bot{ /* Targets all id with 'col-' */
                  border-bottom: 1px solid #EEE;
                }

                #top{min-height: 100px;}
                #mid{min-height: 80px;} 
                #bot{ min-height: 50px;}

                #top .logo{
                  //float: left;
                    height: 60px;
                    width: 60px;
                    background-size: 60px 60px;
                }
                .clientlogo{
                  float: left;
                    height: 60px;
                    width: 60px;
                    background-size: 60px 60px;
                  border-radius: 50px;
                }
                .info{
                  display: block;
                  //float:left;
                  margin-left: 0;
                }
                .title{
                  float: right;
                }
                .title p{text-align: right;} 
                table{
                  width: 100%;                  
                  border: 2px solid black;
                  //border-collapse: collapse;
                }
                td{
                  margin: 5px;
                  padding: 5px 0 5px 15px;
                  border: 2px solid black;
                  text-align: center;
                }
                .tabletitle{
                  //padding: 5px;
                  font-size: .3em;
                  background: grey;
                }
                .service{border-bottom: 1px solid #EEE;}
                .item{width: 24mm;}
                .itemtext{font-size: .5em;}

                #legalcopy{
                  margin-top: 5mm;
                }                
                  
                }
              </style>
              </head>
              <body onload="window.print();window.close()" style="pading-top:20px;">                      
                    <div id="invoice-POS" style="border:1px solid grey;">
                        <center id="top">
                          <div class="logo">
                              <img style="height: 2.5rem;width: 3rem;" src="${this.schoolLogo}"/>
                          </div>
                          <div class="info"> 
                            <h2>${this.schoolName}</h2>
                            <h4>${this.schoolAddress.address}, ${this.schoolAddress.city}, ${this.schoolAddress.district}, ${this.schoolAddress.state}, ${this.schoolAddress.pincode}</h4>
                          </div><!--End Info-->
                        </center><!--End InvoiceTop-->                                                         
                                        <hr/>
                        <center id="top">
                          <div class="info"> 
                            <h2>Fee Receipt</h2>
                          </div><!--End Info-->
                        </center><!--End InvoiceTop-->
                                        <hr/>
                        <div class="info" style="text-align:center;"> 
                            <h3>Student Name: ${this.studentModel.studentName} (${this.studentModel.studentRollNo}) (${this.studentModel.className})</h3>
                        </div><!--End Info-->
                        <div id="bot">

                                        <div id="table">
                                            <table style="border:1px solid black;text-align:center;">
                                                <tr class="tabletitle">
                                                    <td class="Hours" style="background:grey;font-size: .3em;border:1px solid black;margin: 5px;padding: 5px;text-align: center;"><h2>Amount for</h2></td>
                                                    <td class="Hours" style="background:grey;font-size: .3em;border:1px solid black;margin: 5px;padding: 5px;text-align: center;"><h2>Date</h2></td>
                                                    <td class="item" style="background:grey;font-size: .3em;border:1px solid black;margin: 5px;padding: 5px;text-align: center;"><h2>Trans.ID</h2></td>
                                                    <td class="Hours" style="background:grey;font-size: .3em;border:1px solid black;margin: 5px;padding: 5px;text-align: center;"><h2>Trans.Type</h2></td>
                                                    <td class="Hours" style="background:grey;font-size: .3em;border:1px solid black;margin: 5px;padding: 5px;text-align: center;"><h2>Paid by</h2></td>
                                                    <td class="Hours" style="background:grey;font-size: .3em;border:1px solid black;margin: 5px;padding: 5px;text-align: center;"><h2>Phone</h2></td>
                                                    <td class="Rate" style="background:grey;font-size: .3em;border:1px solid black;margin: 5px;padding: 5px;text-align: center;"><h2>Amount</h2></td>
                                                </tr>

                                                <tr class="service">
                                                    <td class="tableitem" style="border:1px solid black;margin: 5px;padding: 5px;text-align: center;"><p class="itemtext">${fee.amountFor}</p></td>
                                                    <td class="tableitem" style="border:1px solid black;margin: 5px;padding: 5px;text-align: center;"><p class="itemtext">${this.util.convertDateIntoDMYHMS(fee.createdDate)}</p></td>
                                                    <td class="tableitem" style="border:1px solid black;margin: 5px;padding: 5px;text-align: center;"><p class="itemtext">${fee.transactionID}</p></td>
                                                    <td class="tableitem" style="border:1px solid black;margin: 5px;padding: 5px;text-align: center;"><p class="itemtext">${fee.transactionType}</p></td>
                                                    <td class="tableitem" style="border:1px solid black;margin: 5px;padding: 5px;text-align: center;"><p class="itemtext">${fee.paidBy}</p></td>
                                                    <td class="tableitem" style="border:1px solid black;margin: 5px;padding: 5px;text-align: center;"><p class="itemtext">${fee.phoneNo}</p></td>
                                                    <td class="tableitem" style="border:1px solid black;margin: 5px;padding: 5px;text-align: center;"><p class="itemtext">${fee.feeAmount}</p></td>
                                                </tr>

                                                <tr class="tabletitle">
                                                    <td colspan="5" class="Rate" style="font-size: .3em;border:1px solid black;margin: 5px;padding: 5px;text-align: center;"><h2>Total amount</h2></td>
                                                    <td colspan="2" class="payment" style="font-size: .3em;border:1px solid black;margin: 5px;padding: 5px;text-align: center;"><h2>Rs. ${fee.feeAmount}</h2></td>
                                                </tr>

                                            </table>
                                        </div><!--End Table-->                                        
                                        <hr/>
                                        <br/>
                                        <div id="legalcopy">
                                            <p class="legal"><strong>Thank you for making payment!</strong>  The balance fee amount is Rs. ${fee.balanceFee}. 
                                            </p>

                                            <p class="legal" style="float:right !important;"><strong>Authorized Signatory 
                                            </p>
                                        </div>

                                    </div><!--End InvoiceBot-->

                                        <br/>
                      </div><!--End Invoice-->

            </body>
          </html>`
        );
        popupWin.document.close();
    }

    ngOnInit() {
        this.schoolLogo = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolLogo : '';
        this.schoolName = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolName : '';
        this.schoolAddress = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolAddress : new Object();
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
    }

    addFee(content) {
        this.message = '';
        this.obj={};
        this.obj.studentID=this.model.studentID;
        this.obj.feeDetails={};
        this.obj.feeDetails.feeAmount=this.model.feeDetails.feeAmount;
        this.obj.feeDetails.amountFor=this.model.feeDetails.amountFor;
        this.obj.feeDetails.paidBy=this.model.feeDetails.paidBy;
        this.obj.feeDetails.phoneNo=this.model.feeDetails.phoneNo;
        if(this.model.balanceFee >0 && this.model.feeDetails.feeAmount>this.model.balanceFee){
            this.message = 'Entered amount is greater than the Balance Fee amount' ;
            this.loading = false;
        }else{
            this.studentService.addFee(this.obj)
            .subscribe(
                data => {
                    if (!data.error) {
                        this.toastr.success('Fee added successfully');
                        this.modalReference.dismiss('Manually');
                        this.fee.emit('Settings saved successfully');
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
    }
}
