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
export class ReportsService {

  constructor(private http: HttpClient, private auth: LoginUserService, private institute: Institute) {}
  getClassAttendanceForPieChart(schoolId?: string, classId?: string): Observable <any> {
    const params = new HttpParams({
      fromString : 'schoolID=' + schoolId + '&classID=' + classId,
    });
    return this.http.get(CONFIG.URL.BASE + CONFIG.URL.GET_CLASS_ATTENDANCE_PIE, {params : params})
    .map((response: Response) => {
        return response;
    });
  }
  getClassAttendanceForBarChart(schoolId?: string, classId?: string): Observable <any> {
    const params = new HttpParams({
      fromString : 'schoolID=' + schoolId + '&classID=' + classId,
    });
    return this.http.get(CONFIG.URL.BASE + CONFIG.URL.GET_CLASS_ATTENDANCE_BAR, {params : params})
    .map((response: Response) => {
        return response;
    });
  }
  getClassAttendanceWithStudents(schoolId?: string, classId?: string): Observable <any> {
    const params = new HttpParams({
      fromString : 'schoolID=' + schoolId + '&classID=' + classId,
    });
    return this.http.get(CONFIG.URL.BASE + CONFIG.URL.GET_CLASS_ATTENDANCE_STUDENTS, {params : params})
    .map((response: Response) => {
        return response;
    });
  }

  //Exam reports
  getAllSubjectsMarkSheet(schoolId?: string, classId?: string, termInstitueId?: string): Observable <any> {
    const params = new HttpParams({
      fromString : 'schoolID=' + schoolId + '&classID=' + classId + '&termInstituteID=' + termInstitueId,
    });
    return this.http.get(CONFIG.URL.BASE + CONFIG.URL.GET_ALL_SUBJECTMARK_SHEET, {params : params})
    .map((response: Response) => {
        return response;
    });
  }
  getAllSubjectDivisionMarkSheet(schoolId?: string, classId?: string, termInstitueId?: string): Observable <any> {
    const params = new HttpParams({
      fromString : 'schoolID=' + schoolId + '&classID=' + classId + '&termInstituteID=' + termInstitueId,
    });
    return this.http.get(CONFIG.URL.BASE + CONFIG.URL.GET_ALL_SUBJECTDIVISIONMARK_SHEET, {params : params})
    .map((response: Response) => {
        return response;
    });
  }
  getSubjectWiseMarkSheet(schoolId?: string, classId?: string, subjectId?: string, termInstitueId?: string): Observable <any> {
    const params = new HttpParams({
      fromString : 'schoolID=' + schoolId + '&classID=' + classId + '&subjectID=' + subjectId + '&termInstituteID=' + termInstitueId,
    });
    return this.http.get(CONFIG.URL.BASE + CONFIG.URL.GET_SUBJECTWISEMARK_SHEET, {params : params})
    .map((response: Response) => {
        return response;
    });
  }

  getTotalMarksForStudents(schoolId?: string, classId?: string, termInstitueId?: string): Observable <any> {
    const params = new HttpParams({
      fromString : 'schoolID=' + schoolId + '&classID=' + classId + '&termInstituteID=' + termInstitueId,
    });
    return this.http.get(CONFIG.URL.BASE + CONFIG.URL.GET_TOTALMARKS_FOR_STUDENTS, {params : params})
    .map((response: Response) => {
        return response;
    });
  }
}
