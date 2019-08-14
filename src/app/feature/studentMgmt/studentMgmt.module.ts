
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

import { StudentListComponent } from './student-list/student-list.component';
import { AlertService, AuthenticationService } from './../../helpers/services/service';
import * as _ from 'underscore';
import { PagerService } from '../../helpers/services/pagination.service';
import { AddStudentComponent } from './add/addStudent.component';
import { ComposeComponent } from './compose/compose.component';
import { FeeComponent } from './fee/fee.component';
import { SettingsComponent } from './settings/settings.component';
import { StarComponent } from './star/star.component';
import { FileUploaderModule } from 'ng4-file-upload/file-uploader.module';
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
    FileUploaderModule,
    ApplicationPipesModule,
  ],
  declarations: [AddStudentComponent, StudentListComponent, ComposeComponent, FeeComponent, SettingsComponent, StarComponent],
  providers: [AlertService, PagerService],
  exports: [],
})
export class StudentMgmtModule { }
