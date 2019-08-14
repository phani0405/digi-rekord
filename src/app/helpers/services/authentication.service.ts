import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { iUser } from '../interfaces/iUser';
import { CONFIG } from '../../app.constant';


@Injectable()
export class AuthenticationService {
    private roles: string;
    constructor( private http: Http) {}

    login(username: string, password: string): Observable<any> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        const obj = {
            userID: username,
            password: password,
            mobileDevice: false
        };
        return this.http.post(CONFIG.URL.BASE + CONFIG.URL.LOGIN, obj, options)
            .map((response: Response) => {
                const user = response.json();
                return user;
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('selectedChildren');
    }
}
