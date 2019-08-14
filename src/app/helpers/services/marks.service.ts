import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { CONFIG } from '../../app.constant';
import { LoginUserService } from './login-user.service';

@Injectable()
export class MarksMgmtService {

  constructor(private http: HttpClient, private auth: LoginUserService) { }


  getStudentsForRemarks(data): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_REPORTS_REMARKS;
    const params = new HttpParams({
      fromString: 'classID=' + data.classID + '&schoolID=' + data.schoolID
        + '&termInstituteID=' + data.termInstituteID
    });
    return this.http.get(URL, { params: params })
      .map((response: Response) => {
        console.log(response);
        return response;
      });
  }

  submitStudentRemarks(data): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.ASSIGN_REPORTS_REMARKS;
    return this.http.put(URL, data)
      .map((response: Response) => {
        console.log(response);
        return response;
      });
  }

  getStudentsForCard(classID): Observable<any> {
    const URL = 'http://localhost:3000/cards';
    return this.http.get(URL)
      .map((response: Response) => {
        console.log(response);
        return response;
      });
  }

  getStudentsForDivision(schoolID): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_ALL_SUBJECT_DIVISION;
    const params = new HttpParams({
      fromString: 'schoolID=' + schoolID
    });
    return this.http.get(URL, { params: params })
      .map((response: Response) => {
        console.log(response);
        return response;
      });
  }

  addDivision(data): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.CREATE_SUBJECT_DIVISION;
    return this.http.post(URL, data)
      .map((response: Response) => {
        console.log(response);
        return response;
      });
  }

  updateDivision(data): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.UPDATE_SUBJECT_DIVISION;
    return this.http.put(URL, data)
      .map((response: Response) => {
        console.log(response);
        return response;
      });
  }

  deleteDivision(data): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.DELETE_SUBJECT_DIVISION;
    return this.http.put(URL, data)
      .map((response: Response) => {
        console.log(response);
        return response;
      });
  }

  getStudentsForMarksReportCard(data): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_SUBJECT_MARKS_CARD;
    const params = new HttpParams({
      fromString: 'classID=' + data.classID + '&schoolID=' + data.schoolID
        + '&termInstituteID=' + data.termID + '&subjectID=' + data.subjectID
    });
    return this.http.get(URL, { params: params })
      .map((response: Response) => {
        console.log(response);
        return response;
      });
  }

  submitStudentMarksReportCard(data): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.ASSIGN_MARKS_CARD;
    return this.http.put(URL, data)
      .map((response: Response) => {
        console.log(response);
        return response;
      });
  }

  studentMarksReport(data): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.STUDENT_MARKS_REPORT;
    const params = new HttpParams({
      fromString: 'studentID=' + data
    });
    return this.http.get(URL, { params: params })
      .map((response: Response) => {
        console.log(response);
        return response;
      });
  }

  setupHllTickets(data): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.SETUP_HALLTICKETS;
    return this.http.put(URL, data)
      .map((response: Response) => {
        console.log(response);
        return response;
      });
  }
  getHallTicket(data): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_HALLTICKET;
    const params = new HttpParams({
      fromString: 'termInstituteID=' + data.termInstituteID + '&schoolID=' + data.schoolID + '&classID=' + data.classID
    });
    return this.http.get(URL, { params: params })
      .map((response: Response) => {
        console.log(response);
        return response;
      });
  }
}
