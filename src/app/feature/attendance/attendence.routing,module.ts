import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceMgmtComponent } from './attendance.component';
import { ViewAttendanceComponent } from './view-attendance/view-attendance.component';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';
import { AuthGuard } from '../../helpers/services/auth-guard.service';

const routes: Routes = [{
  path: '',
  component: AttendanceMgmtComponent,
  children: [{
    path: 'view',
    component: ViewAttendanceComponent,
    canActivate: [AuthGuard],
  }, {
    path: 'take',
    component: MarkAttendanceComponent,
    canActivate: [AuthGuard],
  }],
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
export class AttendanceMgmtRoutingModule {

}

export const routedComponents = [
    AttendanceMgmtComponent,
    ViewAttendanceComponent,
    MarkAttendanceComponent,
];
