import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { CONFIG } from '../../app.constant';
import { LoginUserService } from './login-user.service';

@Injectable()
export class CustomSMSMgmtService {

  constructor(private http: HttpClient, private auth: LoginUserService) { }

  getExcelAttributes(data): Observable<any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_EXCEL_ATTRIBUTES;
    console.log('Sending post request eo get excel attributes', URL, JSON.stringify(filteredObj));
    return this.http.post(URL, filteredObj)
      .map((response: Response) => {
        return response;
      });
  }

  getPreviewSMS(data): Observable<any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_PREVIEW_SMS;
    console.log('Sending post request to get SMS Preview', URL, JSON.stringify(filteredObj));
    return this.http.post(URL, filteredObj)
      .map((response: Response) => {
        return response;
      });
  }

  sendSMS(data): Observable<any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.SEND_SMS;
    console.log('Sending post request to send  SMS', URL, JSON.stringify(filteredObj));
    return this.http.post(URL, filteredObj)
      .map((response: Response) => {
        return response;
      });
  }

  getSMS(data): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_SMS;
    const params = new HttpParams({
      fromString: 'schoolID=' + data.schoolID,
    });
    return this.http.get(URL, { params: params });
  }

}
