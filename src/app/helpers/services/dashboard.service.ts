import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { CONFIG } from '../../app.constant';
import { LoginUserService } from './login-user.service';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient, private auth: LoginUserService) {
  }

  getWidgetForSchoolAdmin(schoolID, collection): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.DASHBOARD_WIDGET;
    const params = new HttpParams({
      fromString: 'schoolID=' + schoolID + '&collection=' + collection,
    });
    console.log('Sending get request for collection', URL, params);
    return this.http.get(URL, { params: params })
      .map((response: Response) => {
        return response;
      });
  }

  getFeeDetails(schoolID, collection): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.DASHBOARD_FEE_DETAILS;
    const params = new HttpParams({
      fromString: 'schoolID=' + schoolID + '&collection=' + collection,
    });
    console.log('Sending get request for collection', URL, params);
    return this.http.get(URL, { params: params })
      .map((response: Response) => {
        return response;
      });
  }

  getWidgetForInstituteAdmin(instituteID, collection): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.INSTITUTE_DASHBOARD_WIDGET;
    const params = new HttpParams({
      fromString: 'instituteID=' + instituteID + '&collection=' + collection,
    });
    console.log('Sending get request for institute collection', URL, params);
    return this.http.get(URL, { params: params })
      .map((response: Response) => {
        return response;
      });
  }

  getTotalAttendance(schoolID): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.DASHBOARD_TOTAL_ATTENDANCE;
    const params = new HttpParams({
      fromString: 'schoolID=' + schoolID
    });
    console.log('Sending get attendance for school', URL, params);
    return this.http.get(URL, { params: params })
      .map((response: Response) => {
        return response;
      });
  }

  getMonthWiseAttendance(schoolID): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.DASHBOARD_MONTH_WISE_ATTENDANCE;
    const params = new HttpParams({
      fromString: 'schoolID=' + schoolID
    });
    console.log('Sending get attendance for school', URL, params);
    return this.http.get(URL, { params: params })
      .map((response: Response) => {
        return response;
      });
  }

  getTotalAttendanceForParent(schoolID, studentID): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.PARENT_TOTAL_ATTENDANCE;
    const params = new HttpParams({
      fromString: 'schoolID=' + schoolID + '&studentID=' + studentID
    });
    console.log('Sending get attendance for school', URL, params);
    return this.http.get(URL, { params: params })
      .map((response: Response) => {
        return response;
      });
  }

  getMonthWiseAttendanceForParent(schoolID, studentID): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.PARENT_MONTH_WISE_ATTENDANCE;
    const params = new HttpParams({
      fromString: 'schoolID=' + schoolID + '&studentID=' + studentID
    });
    console.log('Sending get attendance for school', URL, params);
    return this.http.get(URL, { params: params })
      .map((response: Response) => {
        return response;
      });
  }

}
