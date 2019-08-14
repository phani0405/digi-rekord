import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { CONFIG } from '../../app.constant';
import { LoginUserService } from './login-user.service';
import { Institute } from '../models/institute';

@Injectable()
export class InstituteService {

  constructor(private http: HttpClient, private auth: LoginUserService, private institute: Institute ) {
      }
  getInstitute(): Observable < any > {

    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_ALL_INSTITUTE;
    console.log('Sending post request', URL);
    return this.http.get(URL)
    .map((response: Response) => {
      return response;
    });
  }

  createInstitute(data, instituteLogo): Observable <any> {
    const obj = {
        instituteCode: data.instituteCode,
        instituteName: data.instituteName,
        instituteLogo: instituteLogo,
        userID: data.userID,
        adminName: data.userName,
        adminEmailID: data.email,
        adminMobile: data.mobile,
        createdRole: this.auth.userRole(),
        createdBy: this.auth.userId(),
        instituteAddress: {
          address: data.instituteAddress,
          city: data.instituteCity,
          district: data.instituteDistrict,
          state: data.instituteState,
          pincode: data.institutePinCode,
        },
        sms:data.sms,
        features: data.features,
        timeZone: data.timeZone
    };
    const filteredObj = JSON.parse(JSON.stringify(obj));
    const URL = CONFIG.URL.BASE + CONFIG.URL.CREATE_INSTITUTE;
    console.log('Sending post request', URL, JSON.stringify(filteredObj));

    return this.http.post(URL, filteredObj)
        .map((response: Response) => {
            return response;
        });
  }

  updateInstitute(data, instituteLogo): Observable <any> {
    const obj = {
      instituteID: data.instituteID,
      instituteCode: data.instituteCode,
      instituteName: data.instituteName,
      instituteLogo: instituteLogo,
      userID: data.userID,
      adminName: data.userName,
      adminEmailID: data.email,
      adminMobile: data.mobile,
      updatedRole: this.auth.userRole(),
      updatedBy: this.auth.userId(),
      instituteAddress: {
        address: data.instituteAddress,
        city: data.instituteCity,
        district: data.instituteDistrict,
        state: data.instituteState,
        pincode: data.institutePinCode,
      },
      sms:data.sms,
      features: data.features,
      timeZone: data.timeZone
    };

    const filteredObj = JSON.parse(JSON.stringify(obj));
    const URL = CONFIG.URL.BASE + CONFIG.URL.UPDATE_INSTITUTE;
    console.log('Sending put request', URL, JSON.stringify(filteredObj));
    return this.http.put(URL, filteredObj)
    .map((response: Response) => {
      return response;
    });
  }

  getInstituteByUserId(instituteId?: string): Observable <any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_INSTITUTE_DETAIL;
    let params;
    console.log('Sending get request', URL);
    if (instituteId) {
      params = new HttpParams({fromString : 'instituteID=' + instituteId});
    } else {
      params = new HttpParams({fromString : 'userID=' + this.auth.userId()});
    }
    return this.http.get(URL, {params : params})
    .map((response: Response) => {
        return response;
    });
  }

  
  deleteInstitute(data): Observable <any>{
    const params = new HttpParams({
      fromString : 'instituteID=' + data.instituteID,
    });
    const URL = CONFIG.URL.BASE + CONFIG.URL.DELETE_INSTITUTE;
    return this.http.delete(URL, {params : params}).map((response: Response) => {
      return response;
    });
    //return this.http.delete(URL, {params : params});//
  }

  addSMSCredits(data): Observable <any> {
    data.smsDetails.createdBy=this.auth.userId();
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.ADD_SMS_CREDITS;
    console.log('Sending post request', URL, JSON.stringify(filteredObj));

    return this.http.post(URL, filteredObj)
        .map((response: Response) => {
            return response;
        });
  }

  saveSMSAccountDetails(data): Observable <any> {
    data.smsAccountDetails.createdBy=this.auth.userId();
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.SAVE_SMS_DETAILS;
    console.log('Sending post request', URL, JSON.stringify(filteredObj));

    return this.http.post(URL, filteredObj)
        .map((response: Response) => {
            return response;
        });
  }
}
