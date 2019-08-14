import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { FormLayoutsComponent } from './form-layouts/form-layouts.component';
import { TeacherStaffComponent } from './teacherStaff/teacherStaff.component';
import { StaffMgmtComponent } from './staffMgmt.component';
import { NonTeacherStaffComponent } from './nonTeacherStaff/nonTeacherStaff.component';
import { AuthGuard } from '../../helpers/services/auth-guard.service';

const routes: Routes = [{
  path: '',
  component: StaffMgmtComponent,
  children: [{
    path: 'Yes',
    component: TeacherStaffComponent,
    canActivate: [AuthGuard],
  }, {
    path: 'No',
    component: NonTeacherStaffComponent,
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
export class StaffMgmtRoutingModule {

}

export const routedComponents = [
    StaffMgmtComponent,
    TeacherStaffComponent,
    NonTeacherStaffComponent,
];
