
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

import { AddStaffComponent } from './add/addStaff.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { AlertService, AuthenticationService } from './../../helpers/services/service';
import * as _ from 'underscore';
import { PagerService } from '../../helpers/services/pagination.service';
import { StaffSubjectMappingComponent } from './staffSubjectMapping/staffSubjectMapping.component';
import { FileUploaderModule } from 'ng4-file-upload/file-uploader.module';
import { ApplicationPipesModule } from '../../helpers/filters/applicationFilter.module';
import { StaffMgmtRoutingModule, routedComponents } from './staffMgmt-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    Ng2SmartTableModule,
    FileUploaderModule,
    ApplicationPipesModule,
    StaffMgmtRoutingModule,
  ],
  declarations: [...routedComponents, AddStaffComponent, StaffListComponent, StaffSubjectMappingComponent],
  providers: [AlertService, PagerService],
})
export class StaffMgmtModule { }
