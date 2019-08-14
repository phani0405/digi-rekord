import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { CONFIG } from '../../app.constant';
import { LoginUserService } from './login-user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: LoginUserService, private router: Router) {}

  canActivate() {
    if (this.auth.loggedIn()) {
      return true;
    } else {
      this.router.navigateByUrl(CONFIG.ROUTES.LOGIN);
      return false;
    }
  }
}
