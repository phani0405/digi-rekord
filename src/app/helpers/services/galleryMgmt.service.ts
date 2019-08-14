import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { CONFIG } from '../../app.constant';
import { LoginUserService } from './login-user.service';

@Injectable()
export class GalleryMgmtService {

  constructor(private http: HttpClient, private auth: LoginUserService) { }

  createGallery(data): Observable<any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.CREATE_GALLERY;
    console.log('Sending post request for create gallery', URL, JSON.stringify(filteredObj));
    return this.http.post(URL, filteredObj)
      .map((response: Response) => {
        return response;
      });
  }

  getGalleryImages(data): Observable<any> {
    const URL = CONFIG.URL.BASE + CONFIG.URL.GET_GALLERY;
    const params = new HttpParams({
      fromString: 'schoolID=' + data.schoolID,
    });
    return this.http.get(URL, { params: params });
  }

  addLike(data): Observable<any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.LIKE_GALLERY_IMAGE;
    console.log('Sending put request for like gallery image', URL, JSON.stringify(filteredObj));
    return this.http.put(URL, filteredObj)
      .map((response: Response) => {
        return response;
      });
  }

  addComment(data): Observable<any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.COMMENT_GALLERY_IMAGE;
    console.log('Sending put request for comment gallery image', URL, JSON.stringify(filteredObj));
    return this.http.put(URL, filteredObj)
      .map((response: Response) => {
        return response;
      });
  }

  deleteImage(data): Observable<any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.DELETE_GALLERY_IMAGE;
    const params = new HttpParams({
      fromString: 'imageID=' + data.imageID + '&schoolID=' + data.schoolID,
    });
    console.log('Sending delete request for delete gallery image', URL, params);
    return this.http.delete(URL, { params: params })
      .map((response: Response) => {
        return response;
      });
  }

  deleteComment(data): Observable<any> {
    const filteredObj = JSON.parse(JSON.stringify(data));
    const URL = CONFIG.URL.BASE + CONFIG.URL.DELETE_GALLERY_IMAGE_COMMENT;
    console.log('Sending put request for delete comment', URL, JSON.stringify(filteredObj));
    return this.http.put(URL, filteredObj)
      .map((response: Response) => {
        return response;
      });
  }

}
