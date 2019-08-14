import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { CONFIG } from '../../app.constant';
import { LoginUserService } from './login-user.service';

@Injectable()
export class StudentMgmtService {

  totalUser: number;
  constructor(private http: HttpClient, private auth: LoginUserService) {}
  getStudents(schoolID): Observable <any> {

    // const URL = 'http://localhost:3000/getStudent';
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_ALL_STUDENT;
    const params = new HttpParams({
      fromString : 'schoolID=' + schoolID,
    });
    return this.http.get(URL, {params : params})
    .map((response: Response) => {
      console.log(response);
      this.totalUser = JSON.parse(JSON.stringify(response)).length;
      return response;
    });
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
  create(data, schoolID, schoolName, instituteID): Observable <any> {
    const instituteId =  this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
    const obj = {
      student: {
        studentName: data.userName,
        studentRollNo: data.studentRollNo,
        gender: data.gender,
        classID: data.classID,
        className: data.className,
        schoolID: schoolID,
        schoolName: schoolName,
        instituteID: instituteID,
        photo: data.url,
      },
      father: {
        userID: data.fatherID,
        parentName: data.fatherName,
        parentEmailID: data.fatherEmail,
        parentMobile: data.fatherMobile,
      },
      mother: {
        userID: data.motherID,
        parentName: data.motherName,
        parentEmailID: data.motherEmail,
        parentMobile: data.motherMobile,
      },
      createdRole: this.auth.userRole(),
      createdBy: this.auth.userId(),
    };
    const filteredObj = JSON.parse(JSON.stringify(obj));
    const URL = CONFIG.URL.BASE + CONFIG.URL.CREATE_STUDENT;
    console.log('Sending post request', URL, JSON.stringify(filteredObj));
    return this.http.post(URL, filteredObj)
    .map((response: Response) => {
        return response;
    });
  }

  update(data): Observable <any> {
    const obj = {
      student: {
        studentID: data.studentID,
        studentName: data.userName,
        studentRollNo: data.studentRollNo,
        gender: data.gender,
        classID: data.classID,
        className: data.className,
        schoolID: data.schoolID,
        schoolName: data.schoolName,
        instituteID: data.instituteID,
        photo: data.url,
      },
      father: {
        parentID: data.fatherParentID,
        userID: data.fatherID,
        parentName: data.fatherName,
        parentEmailID: data.fatherEmail,
        parentMobile: data.fatherMobile,
      },
      mother: {
        parentID: data.motherParentID,
        userID: data.motherID,
        parentName: data.motherName,
        parentEmailID: data.motherEmail,
        parentMobile: data.motherMobile,
      },
      updatedRole: this.auth.userRole(),
      updatedBy: this.auth.userId(),
    };
    const filteredObj = JSON.parse(JSON.stringify(obj));
    const URL = CONFIG.URL.BASE + CONFIG.URL.UPDATE_STUDENT;
    // const URL = 'http://localhost:3000/getStudent/' + data.id;
    console.log('Sending post request', URL, JSON.stringify(filteredObj));
    return this.http.put(URL, filteredObj)
    .map((response: Response) => {
        return response;
    });
  }

  getStudentDetail(studentID?: string): Observable <any> {
    const params = new HttpParams({
      fromString : 'studentID=' + studentID,
    });
    return this.http.get(CONFIG.URL.BASE + CONFIG.URL.GET_STUDENT_DETAIL, {params : params})
    .map((response: Response) => {
        return response;
    });
  }


  deleteStudent(data): Observable <any>{
    const params = new HttpParams({
      fromString : 'studentID=' + data.studentID + '&updatedBy=' + data.updatedBy,
    });
    const URL = CONFIG.URL.BASE + CONFIG.URL.DELETE_STUDENT;
    return this.http.delete(URL, {params : params}).map((response: Response) => {
      return response;
    });
    //return this.http.delete(URL, {params : params});//
  }
  saveSettings(data): Observable <any> {
    const obj = {
      studentID: data.studentID,
      totalFee: data.totalFee,
      updatedRole: this.auth.userRole(),
      updatedBy: this.auth.userId(),
    };
    const filteredObj = JSON.parse(JSON.stringify(obj));
    const URL = CONFIG.URL.BASE + CONFIG.URL.SAVE_SETTINGS;
    // const URL = 'http://localhost:3000/getStudent/' + data.id;
    console.log('Sending post request', URL, JSON.stringify(filteredObj));
    return this.http.put(URL, filteredObj)
    .map((response: Response) => {
        return response;
    });
  }
  addFee(data): Observable <any> {
    data.updatedRole= this.auth.userRole();
    data.updatedBy= this.auth.userId();
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.ADD_FEE;
    // const URL = 'http://localhost:3000/getStudent/' + data.id;
    console.log('Sending post request', URL, JSON.stringify(filteredObj));
    return this.http.put(URL, filteredObj)
    .map((response: Response) => {
        return response;
    });
  }
}
