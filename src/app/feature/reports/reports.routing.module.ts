import { CONFIG } from './../../app.constant';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportsComponent } from './reports.component';
import { FeeReportComponent } from './fee/fee.component';
import { StudentMarksReportComponent } from './student-marks/student-marks.component';
import { StudentAttendanceReportComponent } from './student-attendance/student-attendance.component';
import { AuthGuard } from '../../helpers/services/auth-guard.service';

const routes: Routes = [{
  path: '',
  component: ReportsComponent,
  children: [
    {
      path: CONFIG.ROUTES.FEE_REPORT,
      component: FeeReportComponent,
      canActivate: [AuthGuard],
    },
    {
      path: CONFIG.ROUTES.ATTENDANCE_REPORT,
      component: StudentAttendanceReportComponent,
      canActivate: [AuthGuard],
    },
    {
      path: CONFIG.ROUTES.MARKS_REPORT,
      component: StudentMarksReportComponent,
      canActivate: [AuthGuard],
    }
  ],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
  providers: [AuthGuard],
})
export class ReportsRoutingModule {

}

export const routedComponents = [
  ReportsComponent,
  FeeReportComponent,
  StudentAttendanceReportComponent,
  StudentMarksReportComponent
];
