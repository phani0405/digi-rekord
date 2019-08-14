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
import { FeeSetupAssignComponent } from './fee-setup/assign/assign.component';
import { FeeMgmtComponent } from './fee-mgmt.component';
import { FeeMgmtRoutingModule, routedComponents } from './fee-mgmt.routing,module';
import { ChartModule } from 'angular2-chartjs';
//import { StudentMgmtService } from './../../helpers/services/service';
import { AlertService, AttendanceMgmtService } from './../../helpers/services/service';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    ChartModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    Ng2SmartTableModule,
    ApplicationPipesModule,
    FeeMgmtRoutingModule,
  ],
  declarations: [...routedComponents,FeeMgmtComponent,FeeSetupAssignComponent],
  providers: [AlertService, AttendanceMgmtService]
})
export class FeeMgmtModule { }
