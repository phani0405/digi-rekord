
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

import { AddInstituteComponent } from './add/addInstitute.component';
import { SMSAccountComponent } from './sms-account/sms-account.component';
import { SMSComponent } from './sms/sms.component';
import { InstituteListComponent } from './institute-list/institute-list.component';
import { InstituteFilterPipe } from '../../helpers/filters/institute-filter.pipe';
import { InstituteService } from '../../helpers/services/institute.service';
import { AlertService, AuthenticationService } from './../../helpers/services/service';
import * as _ from 'underscore';
import { PagerService } from '../../helpers/services/pagination.service';
import { DatePipe } from '@angular/common';
import {Util} from '../../helpers/util';
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
  declarations: [AddInstituteComponent, InstituteListComponent, InstituteFilterPipe, SMSComponent, SMSAccountComponent],
  providers: [InstituteService, AlertService, PagerService,Util],
  exports: [],
})
export class InstituteMgmtModule { }
