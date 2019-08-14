import { CustomFormsModule } from 'ng2-validation';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, BaseRequestOptions } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import * as _ from 'underscore';
import { DatePipe } from '@angular/common';
import { ApplicationPipesModule } from '../../helpers/filters/applicationFilter.module';
import { MarksMgmtRoutingModule, routedComponents } from './marks.routing.module';
//import { StudentMgmtService } from './../../helpers/services/service';
import { AlertService, AttendanceMgmtService, MarksMgmtService } from './../../helpers/services/service';


@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    Ng2SmartTableModule,
    ApplicationPipesModule,
    MarksMgmtRoutingModule,
    CustomFormsModule
  ],
  declarations: [...routedComponents],
  providers: [AlertService, AttendanceMgmtService, MarksMgmtService]
})
export class MarksModule { }
