import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { CONFIG } from '../../app.constant';
import { LoginUserService } from './login-user.service';

@Injectable()
export class ProfileService {

  constructor(private http: HttpClient, private auth: LoginUserService) { }
  getProfile(paramsObj): Observable <any> {
    
    // const URL = 'http://localhost:3000/getStudent';
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_USER_PROFILE;
    const params = new HttpParams({
      fromString : 'userID=' + paramsObj.userID + '&userRole=' + paramsObj.userRole + '&collection=' + paramsObj.collection,
    });
    return this.http.get(URL, {params : params})
    .map((response: Response) => {
      return response;
    });
  }

  updatePassword(paramsObj): Observable <any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.UPDATE_USER_PASSWORD;
    return this.http.put(URL, paramsObj)
    .map((response: Response) => {
      return response;
    });
  }

  updateUserProfile(paramsObj, updateUrl): Observable <any> {
    const URL = CONFIG.URL.BASE + updateUrl;
    return this.http.put(URL, paramsObj)
    .map((response: Response) => {
      return response;
    });
  }

}
