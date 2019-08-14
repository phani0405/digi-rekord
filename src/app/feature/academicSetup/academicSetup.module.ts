
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, BaseRequestOptions } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { CONFIG } from '../../app.constant';

import { AcademicSetupComponent } from './academicSetup.component';
import { AcademicSetupService } from './../../helpers/services/service';
import * as _ from 'underscore';
import { DatePipe } from '@angular/common';
import { SuperAdminClassSetupComponent } from './superAdmin/classSetup.component';
import { SuperAdminSetupComponent } from './superAdmin/superAdminSetup.component';
import { SuperAdminSubjectSetupComponent } from './superAdmin/subjectSetup.component';
import { InstituteAdminClassSetupComponent } from './instituteAdmin/classSetup.component';
import { InstituteAdminSetupComponent } from './instituteAdmin/instituteAdminSetup.component';
import { InstituteAdminSubjectSetupComponent } from './instituteAdmin/subjectSetup.component';
import { InstituteAdminTermSetupComponent } from './instituteAdmin/termSetup.component';

import { SchoolAdminSubjectSetupComponent } from './schoolAdmin/subjectSetup.component';
import { ApplicationPipesModule } from '../../helpers/filters/applicationFilter.module';


@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    Ng2SmartTableModule,
    ApplicationPipesModule,
  ],
  declarations: [AcademicSetupComponent, SuperAdminSetupComponent,
    SuperAdminClassSetupComponent, SuperAdminSubjectSetupComponent,InstituteAdminSetupComponent,
    InstituteAdminClassSetupComponent, InstituteAdminSubjectSetupComponent, SchoolAdminSubjectSetupComponent,
    InstituteAdminTermSetupComponent
  ],
  providers: [AcademicSetupService],
  exports: [],
})
export class AcademicSetupModule { }
