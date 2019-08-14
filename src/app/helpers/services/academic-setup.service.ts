import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { CONFIG } from '../../app.constant';
import { LoginUserService } from './login-user.service';

@Injectable()
export class AcademicSetupService {

  constructor(private http: HttpClient, private auth: LoginUserService) {
  }
  getAllClasses(): Observable<any> {
    const URL = 'http://localhost:3000/classes';
    return this.http.get(URL)
      .map((response: Response) => {
        return response.json();
      });
  }

  createClasses(data): Observable<any> {
    const instituteId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
    const obj = {
      'instituteID': instituteId,
      'userID': this.auth.userId(),
      'classDetails': {
        'className': data.className,
        'board': data.board
      },
    };
    const URL = CONFIG.URL.BASE + CONFIG.URL.CREATE_CLASS;
    return this.http.post(URL, obj)
      .map((response: Response) => {
        return response;
      });
  }

  updateClasses(data): Observable<any> {
    const instituteId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
    const obj = {
      'instituteID': instituteId,
      'userID': this.auth.userId(),
      'classDetails': {
        'className': data.className,
        'classID': data.classID,
        'board': data.board
      },
    };
    const URL = CONFIG.URL.BASE + CONFIG.URL.UPDATE_CLASS;
    return this.http.put(URL, obj)
      .map((response: Response) => {
        return response;
      });
  }

  getAllSubject(): Observable<any> {
    const URL = 'http://localhost:3000/subjects';
    return this.http.get(URL)
      .map((response: Response) => {
        return response;
      });
  }
  createSubject(data): Observable<any> {
    const instituteId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
    const obj = {
      'instituteID': instituteId,
      'userID': this.auth.userId(),
      'subjectDetails': {
        'subjectName': data.subjectName,
      },
    };
    const URL = CONFIG.URL.BASE + CONFIG.URL.CREATE_SUBJECT;
    return this.http.post(URL, obj)
      .map((response: Response) => {
        return response;
      });
  }

  updateSubject(data): Observable<any> {
    const instituteId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
    const obj = {
      'instituteID': instituteId,
      'userID': this.auth.userId(),
      'subjectDetails': {
        'subjectName': data.subjectName,
        'subjectID': data.subjectID,
      },
    };
    const URL = CONFIG.URL.BASE + CONFIG.URL.UPDATE_SUBJECT;
    return this.http.put(URL, obj)
      .map((response: Response) => {
        return response;
      });
  }

  assignClassSubject(data): Observable<any> {
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const obj = {
      schoolID: schoolId,
      updatedRole: this.auth.userRole(),
      updatedBy: this.auth.userId(),
      userID: this.auth.userId(),
      classDetails: data,
    };

    const URL = CONFIG.URL.BASE + CONFIG.URL.ASSIGN_CLASS_SUBJECT;
    return this.http.put(URL, obj)
      .map((response: Response) => {
        return response;
      });
  }

  createTerms(data): Observable<any> {
    const instituteId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
    const obj = {
      'instituteID': instituteId,
      'updatedBy': this.auth.userId(),
      'termDetails': {
        'termName': data.termName,
      },
    };
    const URL = CONFIG.URL.BASE + CONFIG.URL.INSTITUTE_CREATE_TERM;
    return this.http.post(URL, obj)
      .map((response: Response) => {
        return response;
      });
  }

  updateTerms(data): Observable<any> {
    const instituteId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '';
    const obj = {
      'instituteID': instituteId,
      'userID': this.auth.userId(),
      'termDetails': {
        'termName': data.termName,
        'termID': data.termID
      },
    };
    const URL = CONFIG.URL.BASE + CONFIG.URL.INSTITUTE_UPDATE_TERM;
    return this.http.put(URL, obj)
      .map((response: Response) => {
        return response;
      });
  }

  assignTerms(data): Observable<any> {
    const schoolId = this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : '';
    const obj = {
      schoolID: schoolId,
      updatedRole: this.auth.userRole(),
      updatedBy: this.auth.userId(),
      userID: this.auth.userId(),
      termDetails: data,
    };

    const URL = CONFIG.URL.BASE + CONFIG.URL.SCHOOL_ASSIGN_TERMS;
    return this.http.put(URL, obj)
      .map((response: Response) => {
        return response;
      });
  }
}