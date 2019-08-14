
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, BaseRequestOptions } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';

import { CONFIG } from '../../app.constant';

import { AddSchoolComponent } from './add/addSchool.component';
import { SchoolListComponent } from './school-list/school-list.component';
import { AlertService, AuthenticationService, SchoolMgmtService } from './../../helpers/services/service';
import * as _ from 'underscore';
import { PagerService } from '../../helpers/services/pagination.service';
import { SchoolFilterPipe } from '../../helpers/filters/school-filter.pipe';
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
  declarations: [AddSchoolComponent, SchoolListComponent, SchoolFilterPipe],
  providers: [SchoolMgmtService, AlertService, PagerService],
  exports: [],
})
export class SchoolMgmtModule { }
