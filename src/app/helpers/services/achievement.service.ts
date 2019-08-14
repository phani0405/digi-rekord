import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { CONFIG } from '../../app.constant';
import { LoginUserService } from './login-user.service';

@Injectable()
export class AchievementMgmtService {

  constructor(private http: HttpClient, private auth: LoginUserService) { }

  createAchievement(data): Observable<any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.CREATE_ACHIEVEMENT;
    console.log('Sending post request for create achievement', URL, JSON.stringify(filteredObj));
    return this.http.post(URL, filteredObj)
      .map((response: Response) => {
        return response;
      });
  }

  getAchievements(data): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_ACHIEVEMENT;
    const params = new HttpParams({
      fromString: 'schoolID=' + data.schoolID,
    });
    return this.http.get(URL, { params: params });
  }

  addLike(data): Observable<any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.LIKE_ACHIEVEMENT;
    console.log('Sending put request for like gallery image', URL, JSON.stringify(filteredObj));
    return this.http.put(URL, filteredObj)
      .map((response: Response) => {
        return response;
      });
  }

  addComment(data): Observable<any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.COMMENT_ACHIEVEMENT;
    console.log('Sending put request for comment achievement image', URL, JSON.stringify(filteredObj));
    return this.http.put(URL, filteredObj)
      .map((response: Response) => {
        return response;
      });
  }

  deleteImage(data): Observable<any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.DELETE_GALLERY_IMAGE;
    const params = new HttpParams({
      fromString: 'acheivementID=' + data.acheivementID + '&schoolID=' + data.schoolID,
    });
    console.log('Sending delete request for delete achievement image', URL, params);
    return this.http.delete(URL, { params: params })
      .map((response: Response) => {
        return response;
      });
  }

  deleteAchievement(data): Observable<any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.DELETE_ACHIEVEMENT;
    const params = new HttpParams({
      fromString: 'acheivementID=' + data.acheivementID + '&schoolID=' + data.schoolID,
    });
    console.log('Sending delete request for delete achievement image', URL, params);
    return this.http.delete(URL, { params: params })
      .map((response: Response) => {
        return response;
      });
  }

  

  deleteComment(data): Observable<any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.DELETE_ACHIEVEMENT_COMMENT;
    console.log('Sending put request for delete comment', URL, JSON.stringify(filteredObj));
    return this.http.put(URL, filteredObj)
      .map((response: Response) => {
        return response;
      });
  }

}
