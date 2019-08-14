import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { CONFIG } from '../../app.constant';
import { LoginUserService } from './login-user.service';

@Injectable()
export class FeeService {

  constructor(private http: HttpClient, private auth: LoginUserService) {
  }

  getFeeTypes(): Observable<any> {
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_FEETYPES;
    const params = new HttpParams({
        fromString : 'schoolID=' + schoolId
    });
    return this.http.get(URL, {params : params})
      .map((response: Response) => {
        return response;
      });
  }

  createFeeType(data): Observable<any> {
    const instituteId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const userId = this.auth.userId();
    const obj = {
      'feeTypeName': data.feeTypeName,
      'feeUserTypeName': data.feeUserTypeName,
      'instituteID': instituteId,
      'schoolID': schoolId,
      'createdBy': userId,
      'updatedBy': userId
    };
    const URL = CONFIG.URL.BASE + CONFIG.URL.CREATE_FEETYPE;
    return this.http.post(URL, obj)
      .map((response: Response) => {
        return response;
      });
  }

  updateFeeType(data): Observable<any> {
    const instituteId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const userId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].userID : '';
    const obj = {
      'feeTypeID': data.feeTypeID,
      'feeTypeName': data.feeTypeName,
      'feeUserTypeName': data.feeUserTypeName,
      'instituteID': instituteId,
      'schoolID': schoolId,
      'updatedBy': this.auth.userId()
    };
    const URL = CONFIG.URL.BASE + CONFIG.URL.UPDATE_FEETYPE;
    return this.http.put(URL, obj)
      .map((response: Response) => {
        return response;
      });
  }

  getFeeTerms(): Observable<any> {
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_FEETERMS;
    const params = new HttpParams({
        fromString : 'schoolID=' + schoolId
    });
    return this.http.get(URL, {params : params})
      .map((response: Response) => {
        return response;
      });
  }

  createFeeTerm(data): Observable<any> {
    const instituteId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const obj = {
      'feeTerm': data.feeTerm,
      'instituteID': instituteId,
      'schoolID': schoolId,
      'createdBy': this.auth.userId(),
      'updatedBy': this.auth.userId()
    };
    const URL = CONFIG.URL.BASE + CONFIG.URL.CREATE_FEETERM;
    return this.http.post(URL, obj)
      .map((response: Response) => {
        return response;
      });
  }

  updateFeeTerm(data): Observable<any> {
    const instituteId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const obj = {
      'feeTermID': data.feeTermID,
      'feeTerm': data.feeTerm,
      'instituteID': instituteId,
      'schoolID': schoolId,
      'updatedBy': this.auth.userId()
    };
    const URL = CONFIG.URL.BASE + CONFIG.URL.UPDATE_FEETERM;
    return this.http.put(URL, obj)
      .map((response: Response) => {
        return response;
      });
  }

  getFees(): Observable<any> {
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_FEES;
    const params = new HttpParams({
        fromString : 'schoolID=' + schoolId
    });
    return this.http.get(URL, {params : params})
      .map((response: Response) => {
        return response;
      });
  }

  createFee(data): Observable<any> {
    const instituteId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const obj = {
      'feeTypeID': data.feeTypeID,
      'feeTermID': data.feeTermID,
      'feeTitle': data.feeTitle,
      'startDate': data.startDate,
      'dueDate': data.dueDate,
      'lateFeeDate': data.lateFeeDate,
      'amount': data.amount,
      'instituteID': instituteId,
      'schoolID': schoolId,
      'createdBy': this.auth.userId(),
      'updatedBy': this.auth.userId()
    };
    const URL = CONFIG.URL.BASE + CONFIG.URL.CREATE_FEE;
    return this.http.post(URL, obj)
      .map((response: Response) => {
        return response;
      });
  }

  updateFee(data): Observable<any> {
    const instituteId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const obj = {
      'feeID': data.feeID,
      'feeTypeID': data.feeTypeID,
      'feeTermID': data.feeTermID,
      'feeTitle': data.feeTitle,
      'startDate': data.startDate,
      'dueDate': data.dueDate,
      'lateFeeDate': data.lateFeeDate,
      'amount': data.amount,
      'instituteID': instituteId,
      'schoolID': schoolId,
      'updatedBy': this.auth.userId()
    };
    const URL = CONFIG.URL.BASE + CONFIG.URL.UPDATE_FEE;
    return this.http.put(URL, obj)
      .map((response: Response) => {
        return response;
      });
  }

  assignFeesClasswise(data): Observable<any> {
    const instituteId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const obj = {
      'feeID': data.feeID,
      'schoolID': schoolId,
      'createdBy': this.auth.userId(),
      'updatedBy': this.auth.userId(),
      'classes': data.classes
    };
    const URL = CONFIG.URL.BASE + CONFIG.URL.ASSIGN_FEES_CLASSWISE;
    return this.http.post(URL, obj)
      .map((response: Response) => {
        return response;
      });
  }

  getAssignedFeesClasswise(feeID): Observable<any> {
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_ASSIGNED_FEE_CLASSWISE;
    const params = new HttpParams({
        fromString : 'schoolID=' + schoolId + '&feeID=' + feeID
    });
    return this.http.get(URL, {params : params})
      .map((response: Response) => {
        return response;
      });
  }

  getStudents(data): Observable <any> {

    // const URL = 'http://localhost:3000/getStudent';
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_ALL_STUDENT;
    const params = new HttpParams({
      fromString : 'schoolID=' + data.schoolId + '&classID=' + data.classId,
    });
    return this.http.get(URL, {params : params})
    .map((response: Response) => {
      console.log(response);
      return response;
    });
  }

  getAssignedFeesStudentwise(studentId): Observable<any> {
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_ASSIGNED_FEE_STUDENTWISE;
    const params = new HttpParams({
        fromString : 'studentID=' + studentId
    });
    return this.http.get(URL, {params : params})
      .map((response: Response) => {
        return response;
      });
  }

  collectFee(data): Observable<any> {
    const obj = {
      'schoolID': data.schoolID,
      'studentID': data.selectedStudent.studentRollNo,
      'amount': data.amount,
      'modeOfPayment': data.modeOfPayment,
      'referenceNo': data.referenceNo,
      'paidBy': data.paidBy,
      'mobile': data.mobile,
      'remarks': data.remarks,
      'collection': data.collection,
      'createdBy': this.auth.userId(),
      'updatedBy': this.auth.userId()
    };
    const URL = CONFIG.URL.BASE + CONFIG.URL.COLLECT_FEE;
    return this.http.post(URL, obj)
      .map((response: Response) => {
        return response;
      });
  }
  
  getStudentFeePayments(studentId): Observable<any> {
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_FEE_PAYMENTS;
    const params = new HttpParams({
        fromString : 'studentID=' + studentId
    });
    return this.http.get(URL, {params : params})
      .map((response: Response) => {
        return response;
      });
  }
  
  getStudentFeeTransactions(receiptNo): Observable<any> {
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_FEE_TRANSACTIONS;
    const params = new HttpParams({
        fromString : 'receiptNo=' + receiptNo
    });
    return this.http.get(URL, {params : params})
      .map((response: Response) => {
        return response;
      });
  }

  assignFeeStudentWise(data): Observable<any> {
    data.updatedBy = this.auth.userId();
    const obj = data;
    const URL = CONFIG.URL.BASE + CONFIG.URL.ASSIGN_FEE_STUDENTWISE;
    return this.http.post(URL, obj)
      .map((response: Response) => {
        return response;
      });
  }

  getSummaryReport(): Observable<any> {
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_SUMMARY_REPORT;
    const params = new HttpParams({
        fromString : 'schoolID=' + schoolId
    });
    return this.http.get(URL, {params : params})
      .map((response: Response) => {
        return response;
      });
  }

  getReports(data): Observable<any> {
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_FEE_REPORT;
    data.schoolID=schoolId;
    return this.http.post(URL, data)
      .map((response: Response) => {
        return response;
      });
  }

  getTrendReport(): Observable<any> {
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_TREND_REPORT;
    const params = new HttpParams({
        fromString : 'schoolID=' + schoolId
    });
    return this.http.get(URL, {params : params})
      .map((response: Response) => {
        return response;
      });
  }

}