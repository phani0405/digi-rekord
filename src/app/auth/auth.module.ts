import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule, BaseRequestOptions } from '@angular/http';

import { CONFIG } from '../app.constant';

import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from '../feature/user-profile/user-profile.component';
import { AlertComponent } from '../helpers/directives/alert.component';
import { AlertService } from '../helpers/services/alert.service';
import { ThemeModule } from '../@theme/theme.module';

const coreRoutes: Routes = [
    {path: CONFIG.ROUTES.LOGIN, component: LoginComponent},
];

@NgModule({
  imports: [
    BrowserModule,
    ThemeModule,
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule.forChild(coreRoutes),
  ],
  declarations: [LoginComponent, AlertComponent],
  providers: [AlertService],
  exports: [RouterModule],
})
export class AuthModule { }
