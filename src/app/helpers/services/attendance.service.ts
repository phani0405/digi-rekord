import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { CONFIG } from '../../app.constant';
import { LoginUserService } from './login-user.service';

@Injectable()
export class AttendanceMgmtService {

  constructor(private http: HttpClient, private auth: LoginUserService) { }

  getStudentsForAttendance(data): Observable <any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_STUDENTS_FOR_ATTENDANCE;
    const params = new HttpParams({
        fromString : 'schoolID=' + data.schoolID + '&classID=' + data.classID + '&date=' + data.date
                     + '&month=' + data.month + '&year=' + data.year + '&periodID=' + data.periodID
    });
    return this.http.get(URL, {params : params})
    .map((response: Response) => {
      console.log(response);
      return response;
    });
  }
  
  submitAttendance(data): Observable <any> {
    data.updatedBy = this.auth.userId();
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.CREATE_ATTENDANCE;
    console.log('Sending post request', URL, JSON.stringify(filteredObj));
    return this.http.put(URL, filteredObj)
        .map((response: Response) => {
            return response;
        });
  }

  triggerSMS(data): Observable <any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.SND_SMS_FOR_ABSENT;
    console.log('Sending post request', URL, JSON.stringify(filteredObj));
    return this.http.post(URL, filteredObj)
    .map((response: Response) => {
        return response;
    });
  }

  getOverAllAttendance(data): Observable <any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_OVERALL_ATTENDANCE;
    const params = new HttpParams({
        fromString : 'schoolID=' + data.schoolID + '&classID=' + data.classID
         + '&fromDate=' + data.from.date + '&fromMonth=' + data.from.month + '&fromYear=' + data.from.year
         + '&toDate=' + data.to.date + '&toMonth=' + data.to.month + '&toYear=' + data.to.year
    });
    return this.http.get(URL, {params : params})
    .map((response: Response) => {
      console.log(response);
      return response;
    });
  }

  getStudentAttendanceDetail(data): Observable <any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_STUDENT_ATTENDANCE_DETAIL;
    const params = new HttpParams({
        fromString : 'schoolID=' + data.schoolID + '&classID=' + data.classID + '&studentID=' + data.studentID
         + '&fromDate=' + data.from.date + '&fromMonth=' + data.from.month + '&fromYear=' + data.from.year
         + '&toDate=' + data.to.date + '&toMonth=' + data.to.month + '&toYear=' + data.to.year
    });
    return this.http.get(URL, {params : params})
    .map((response: Response) => {
      console.log(response);
      return response;
    });
  }
  
}
