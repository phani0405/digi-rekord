import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LoginUserService } from '../services/service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(public auth: LoginUserService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      let headers:any = {
        'Authorization': this.auth.apiKey(),
        'Content-Type': 'application/json',
      }
      if(this.auth.currentAcademicYear()) {
        headers.currentAcademicYear = this.auth.currentAcademicYear()
      }
      request = request.clone({
        setHeaders: headers,
      });
      return next.handle(request);
    }
}

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

    constructor(public auth: LoginUserService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).do((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        }, (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              
              this.auth.logout();
            }
          }
        });
    }
}
