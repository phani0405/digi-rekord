import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { CONFIG } from '../../app.constant';

@Injectable()
export class AcademicYearsService {

  constructor(private HttpClient: HttpClient) { }

  getAcademicYears(): Observable <any> {
    // const headers = new Headers({ 'Content-Type': 'application/json', Authorization: this.auth.apiKey(), });
    // const options = new RequestOptions({ headers: headers });
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_ACADEMIC_YEARS;
    return this.HttpClient.get(URL)
    .map((response: Response) => {
      return response;
    });
  }

}
