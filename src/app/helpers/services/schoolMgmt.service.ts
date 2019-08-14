import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { LoginUserService } from './login-user.service';

import { CONFIG } from '../../app.constant';
import { Institute } from '../models/institute';

@Injectable()
export class SchoolMgmtService {

  totalUser: number;
  constructor(private http: HttpClient, private auth: LoginUserService, private institute: Institute) {}
  getSchool(): Observable <any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_ALL_SCHOOL;
    const instituteId =  this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
    const params = new HttpParams({
      fromString : 'instituteID=' + instituteId,
    });
    return this.http.get(URL, {params : params})
    .map((response: Response) => {
      console.log(response);
      return response;
    });
  }

  createSchool(data, schoolLogo): Observable <any> {
    const instituteId =  this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
    const obj = {
        schoolCode: data.schoolCode,
        schoolName: data.schoolName,
        schoolLogo: schoolLogo,
        instituteID: instituteId,
        userID: data.userID,
        adminName: data.userName,
        adminEmailID: data.email,
        adminMobile: data.mobile,
        createdRole: this.auth.userRole(),
        createdBy: this.auth.userId(),
        schoolOpenTime: data.openTime,
        schoolCloseTime: data.closeTime,
        schoolAddress: {
          address: data.schoolAddress,
          city: data.schoolCity,
          district: data.schoolDistrict,
          state: data.schoolState,
          pincode: data.schoolPinCode,
        },
    };
    const filteredObj = JSON.parse(JSON.stringify(obj));
    const URL = CONFIG.URL.BASE + CONFIG.URL.CREATE_SCHOOL;
    console.log('Sending post request', URL, JSON.stringify(filteredObj));
    return this.http.post(URL, filteredObj)
    .map((response: Response) => {
        return response;
    });
  }

  updateSchool(data, schoolLogo): Observable <any> {
    const obj = {
      schoolID: data.schoolID,
      schoolCode: data.schoolCode,
      schoolName: data.schoolName,
      schoolLogo: schoolLogo,
      userID: data.userID,
      adminName: data.userName,
      adminEmailID: data.email,
      adminMobile: data.mobile,
      updatedRole: this.auth.userRole(),
      updatedBy: this.auth.userId(),
      schoolOpenTime: data.schoolOpenTime,
      schoolCloseTime: data.schoolCloseTime,
      schoolAddress: {
        address: data.schoolAddress,
        city: data.schoolCity,
        district: data.schoolDistrict,
        state: data.schoolState,
        pincode: data.schoolPinCode,
      },
  };
  const filteredObj = JSON.parse(JSON.stringify(obj));
  const URL = CONFIG.URL.BASE + CONFIG.URL.UPDATE_SCHOOL;
  console.log('Sending post request', URL, JSON.stringify(filteredObj));
    return this.http.put(URL, filteredObj)
    .map((response: Response) => {
      return response;
    });
  }

  getSchoolDetail(schoolId?: string): Observable <any> {
    const params = new HttpParams({
      fromString : 'schoolID=' + schoolId,
    });
    return this.http.get(CONFIG.URL.BASE + CONFIG.URL.GET_SCHOOL_DETAIL, {params : params})
    .map((response: Response) => {
        return response;
    });
  }

  deleteSchool(data): Observable <any> {
    const params = new HttpParams({
      fromString : 'schoolID=' + data.schoolID  + '&updatedBy=' + data.updatedBy,
    });
    const URL = CONFIG.URL.BASE + CONFIG.URL.DELETE_SCHOOL;
    console.log('Sending delete request', URL, params);
    return this.http.delete(URL, {params : params}).map((response: Response) => {
      return response;
    });
  }

  getStates(): Observable <any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_STATES;
    console.log('Sending get state request', URL);
    return this.http.get(URL).map((response: Response) => {
      return response;
    });
  }

  getDistricts(): Observable <any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_DISTRICTS;
    console.log('Sending get district request', URL);
    return this.http.get(URL).map((response: Response) => {
      return response;
    });
  }

  getAllFeatures(): Observable <any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_ALL_FEATURES;
    console.log('Sending get features request', URL);
    return this.http.get(URL).map((response: Response) => {
      return response;
    });
  }
  
  getTimeZones(): Observable <any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_TIME_ZONES;
    console.log('Sending get features request', URL);
    return this.http.get(URL).map((response: Response) => {
      return response;
    });
  }
}
