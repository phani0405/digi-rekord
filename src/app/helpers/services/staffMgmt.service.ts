import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { CONFIG } from '../../app.constant';
import { LoginUserService } from './login-user.service';

@Injectable()
export class StaffMgmtService {

  constructor(private http: HttpClient, private auth: LoginUserService) {
      }

  checkUserExists(userId): Observable < any > {

    const URL = CONFIG.URL.BASE + CONFIG.URL.CHECK_USER_EXISTS;
    const params = new HttpParams({fromString : 'userID=' + userId });
    console.log('Sending user check request', URL, params);
    return this.http.get(URL, {params : params})
    .map((response: Response) => {
      return response;
    });
    
  }
  getStaff(userId, schoolID, teaching?: string): Observable < any > {

    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_ALL_STAFFS;
    const params = new HttpParams({fromString : 'userId=' + userId + '&schoolID=' + schoolID + '&teaching=' + teaching });
    console.log('Sending get request', URL, params);
    return this.http.get(URL, {params : params})
    .map((response: Response) => {
      return response;
    });
  }

  createStaff(data, schoolId, teaching): Observable <any> {
    const obj = {
        schoolID: schoolId,
        createdRole: this.auth.userRole(),
        createdBy: this.auth.userId(),
        staffName: data.userName,
        gender: data.gender,
        staffRole: data.staffRole,
        userID: data.userID,
        staffEmailID: data.email,
        staffMobile: data.mobile,
        teaching: teaching,
        qualification: data.qualification,
        yearOfPassing: data.yearOfPassing,
        attachments: data.attachments,
        photo: data.url,
        staffAddress: {
          address: data.staffAddress,
          city: data.staffCity,
          district: data.staffDistrict,
          state: data.staffState,
          pincode: data.staffPinCode,
        },
    };
    const filteredObj = JSON.parse(JSON.stringify(obj));
    const URL = CONFIG.URL.BASE + CONFIG.URL.CREATE_STAFF;
    console.log('Sending post request', URL, JSON.stringify(filteredObj));

    return this.http.post(URL, filteredObj)
        .map((response: Response) => {
            return response;
        });
  }

  updateStaff(data): Observable <any> {
    const obj = {
      schoolID: data.schoolID,
      staffID: data.staffID,
      staffName: data.userName,
      userID: data.userID,
      staffEmailID: data.email,
      staffMobile: data.mobile,
      gender: data.gender,
      teaching: data.teaching,
      staffRole: data.staffRole,
      updatedRole: this.auth.userRole(),
      updatedBy: this.auth.userId(),
      qualification: data.qualification,
      yearOfPassing: data.yearOfPassing,
      attachments: data.attachments,
      photo: data.url,
      staffAddress: {
        address: data.staffAddress,
        city: data.staffCity,
        district: data.staffDistrict,
        state: data.staffState,
        pincode: data.staffPinCode,
      },
    };

    const filteredObj = JSON.parse(JSON.stringify(obj));
    const URL = CONFIG.URL.BASE + CONFIG.URL.UPDATE_STAFF;
    console.log('Sending put request', URL, JSON.stringify(filteredObj));
    return this.http.put(URL, filteredObj)
    .map((response: Response) => {
      return response;
    });
  }

  getStaffByUserId(staffId?: string): Observable <any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_INSTITUTE_DETAIL;
    let params;
    if (staffId) {
      params = new HttpParams({fromString : 'staffID=' + staffId});
    } else {
      params = new HttpParams({fromString : 'userID=' + this.auth.userId()});
    }
    console.log('Sending get request', URL, params);
    return this.http.get(URL, {params : params})
    .map((response: Response) => {
        return response;
    });
  }

  assignSubject(data, staffID, classTeacher): Observable <any> {
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const obj = {
      staffID: staffID,
      schoolID: schoolId,
      updatedBy: this.auth.userId(),
      subjects: data,
      classTeacherDetails: classTeacher,
    };

    const URL = CONFIG.URL.BASE + CONFIG.URL.UPDATE_STAFF;
    console.log('Calling assign subject', URL, JSON.stringify(obj));
    return this.http.put(URL, obj)
        .map((response: Response) => {
            return response;
        });
  }

  deleteStaff(data): Observable <any> {

    const params = new HttpParams({
      fromString : 'staffID=' + data.staffID  + '&updatedBy=' + data.updatedBy,
    });
    const URL = CONFIG.URL.BASE + CONFIG.URL.DELETE_STAFF;
    console.log('Sending delete request', URL, params);
    return this.http.delete(URL, {params : params}).map((response: Response) => {
      return response;
    });
  }

  getStaffRoles(): Observable <any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_STAFF_ROLES;
    return this.http.get(URL)
    .map((response: Response) => {
        return response;
    });
  }

  deleteStaffAttachment(staffID, fileIds): Observable <any> {

    const obj = {
      "staffID": staffID,
      "fileIDs": fileIds,
      "updatedBy": this.auth.userId()
    }
    const URL = CONFIG.URL.BASE + CONFIG.URL.DELETE_STAFF_ATTACHMENT;
    console.log('Calling delete attachment for staff', URL, JSON.stringify(obj));
    return this.http.put(URL, obj)
        .map((response: Response) => {
            return response;
        });
      }
}
