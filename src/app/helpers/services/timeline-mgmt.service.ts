import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { CONFIG } from '../../app.constant';
import { LoginUserService } from './login-user.service';

@Injectable()
export class TimelineMgmtService {

  constructor(private http: HttpClient, private auth: LoginUserService) { }

  create(data): Observable <any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.COMPOSE_MESSAGE;
    console.log('Sending post request', URL, JSON.stringify(filteredObj));
    return this.http.post(URL, filteredObj)
    .map((response: Response) => {
        return response;
    });
  }

  triggerSMS(data): Observable <any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.SND_SMS;
    console.log('Sending post request', URL, JSON.stringify(filteredObj));
    return this.http.post(URL, filteredObj)
    .map((response: Response) => {
        return response;
    });
  }

  getClassStudents(param): Observable <any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_ALL_CLASS_STUDENTS;
    var params;
    if(param.key == "staffID"){
      params = new HttpParams({
        fromString : 'staffID=' + param.value,
      });
    }
    else{
      params = new HttpParams({
        fromString : 'schoolID=' + param.value,
      });
    } 
    return this.http.get(URL, {params : params})
    .map((response: Response) => {
      console.log(response);
      return response;
    });
  }

  getAllMessages(userID): Observable <any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_ALL_MESSAGES;
    const params = new HttpParams({
      fromString : 'userID=' + userID,
    });
    return this.http.get(URL, {params : params})
    .map((response: Response) => {
      console.log(response);
      return response;
    });
  }

}
