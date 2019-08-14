import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { CONFIG } from '../../app.constant';
import { LoginUserService } from './login-user.service';

@Injectable()
export class LeaveMgmtService {

  constructor(private http: HttpClient, private auth: LoginUserService) { }

  getLeaves(userID,isApproveLeaves): Observable <any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_ALL_LEAVES;
    const params = new HttpParams({
      fromString : 'userID=' + userID + '&approveLeaves=' + isApproveLeaves,
    });
    return this.http.get(URL, {params : params})
    .map((response: Response) => {
      console.log(response);
      return response;
    });
  }

  getStaffLeaves(userID,isApproveLeaves): Observable <any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_STAFF_LEAVES;
    const params = new HttpParams({
      fromString : 'userID=' + userID + '&approveLeaves=' + isApproveLeaves,
    });
    return this.http.get(URL, {params : params})
    .map((response: Response) => {
      return response;
    });
  }

  applyLeave(data): Observable <any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.APPLY_LEAVE;
    console.log('Sending post request', URL, JSON.stringify(filteredObj));
    return this.http.post(URL, filteredObj)
    .map((response: Response) => {
        return response;
    });
  }

  applyStaffLeave(data): Observable <any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.APPLY_STAFF_LEAVE;
    console.log('Sending post request', URL, JSON.stringify(filteredObj));
    return this.http.post(URL, filteredObj)
    .map((response: Response) => {
        return response;
    });
  }

  approveLeave(data): Observable <any>{
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.APPROVE_REJECT_LEAVE;
    return this.http.put(URL, filteredObj)
    .map((response: Response) => {
        return response;
    });
  }

  approveStaffLeave(data): Observable <any>{
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.APPROVE_REJECT_STAFF_LEAVE;
    return this.http.put(URL, filteredObj)
    .map((response: Response) => {
        return response;
    });
  }

}
