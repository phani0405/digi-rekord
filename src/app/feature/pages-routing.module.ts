import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InstituteListComponent } from './instituteMgmt/institute-list/institute-list.component';
import { CONFIG } from '../app.constant';
import { SchoolListComponent } from './schoolMgmt/school-list/school-list.component';
import { InstituteProfileComponent } from './instituteProfile/institute-profile.component';
import { AuthGuard } from '../helpers/services/auth-guard.service';
import { AcademicSetupComponent } from './academicSetup/academicSetup.component';
import { StudentListComponent } from './studentMgmt/student-list/student-list.component';
import { FeedComponent } from './timeline/feed/feed.component';
import { LeaveListComponent } from './leave-mgmt/leave-list/leave-list.component';
import { LeaveMgmtComponent, MyLeavesComponent, LeavesForApprovalComponent } from './leave-mgmt/leave-mgmt.component';
import { GalleryListComponent } from './gallery/gallery-list/gallery-list.component';
import { AchievementListComponent } from './achievements/achievement-list/achievement-list.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SMSListComponent } from './customSMS/sms-list/sms-list.component';

const routes: Routes = [
  {
    path: CONFIG.ROUTES.PRIVATE,
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: CONFIG.ROUTES.DASHBOARD,
        component: DashboardComponent,
        canActivate: [AuthGuard],
      }, {
        path: CONFIG.ROUTES.INSTITUTE,
        component: InstituteListComponent,
        canActivate: [AuthGuard],
      }, {
        path: CONFIG.ROUTES.SCHOOL_MGMT,
        component: SchoolListComponent,
        canActivate: [AuthGuard],
      }, {
        path: CONFIG.ROUTES.INSTITUTE_PROFILE,
        component: InstituteProfileComponent,
        canActivate: [AuthGuard],
      }, {
        path: CONFIG.ROUTES.ACADEMIC_SETUP,
        component: AcademicSetupComponent,
        canActivate: [AuthGuard],
      }, {
        path: CONFIG.ROUTES.STAFF,
        loadChildren: './staffMgmt/staffMgmt.module#StaffMgmtModule',
      }, {
        path: CONFIG.ROUTES.STUDENT,
        component: StudentListComponent,
        canActivate: [AuthGuard],
      }, {
        path: CONFIG.ROUTES.TIMELINE,
        component: FeedComponent,
        canActivate: [AuthGuard],
      }, {
        path: CONFIG.ROUTES.LEAVE_MGMT,
        component: LeaveMgmtComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: CONFIG.ROUTES.MY_LEAVES,
            pathMatch: 'full',
          }, {
            path: CONFIG.ROUTES.MY_LEAVES,
            component: MyLeavesComponent,
          }, {
            path: CONFIG.ROUTES.LEAVES_FOR_APPROVE,
            component: LeavesForApprovalComponent,
          }
        ],
      }, {
        path: CONFIG.ROUTES.ATTENDANCE,
        loadChildren: './attendance/attendance.module#AttendanceModule',
        canActivate: [AuthGuard],
      }, {
        path: CONFIG.ROUTES.GALLERY,
        component: GalleryListComponent,
        canActivate: [AuthGuard],
      }, {
        path: CONFIG.ROUTES.ACHIEVEMENTS,
        component: AchievementListComponent,
        canActivate: [AuthGuard],
      }, {
        path: CONFIG.ROUTES.PROFILE,
        component: UserProfileComponent,
        canActivate: [AuthGuard],
      }, {
        path: CONFIG.ROUTES.HALLTICKETS,
        loadChildren: './hallTickets/hallTickets.module#HallTicketsModule',
        canActivate: [AuthGuard],
      },{
        path: CONFIG.ROUTES.CUSTOM_SMS,
        component: SMSListComponent,
        canActivate: [AuthGuard],
      },{
        path: CONFIG.ROUTES.MARKS,
        loadChildren: './marks/marks.module#MarksModule',
        canActivate: [AuthGuard],
      }, {
        path: CONFIG.ROUTES.TRANSPORT,
        loadChildren: './transport/transport.module#TransportModule',
        canActivate: [AuthGuard],
      }, {
        path: CONFIG.ROUTES.REPORTS,
        loadChildren: './reports/reports.module#ReportsModule',
        canActivate: [AuthGuard],
      }, {
        path: CONFIG.ROUTES.FEE_MGMT,
        loadChildren: './fee-mgmt/fee-mgmt.module#FeeMgmtModule',
        canActivate: [AuthGuard],
      },{
        path: '',
        redirectTo: CONFIG.ROUTES.DASHBOARD,
        pathMatch: 'full',
      },{
        path: 'prof',
        redirectTo: CONFIG.ROUTES.PROFILE,
        pathMatch: 'full',
      }
    ],
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class PagesRoutingModule {
}
