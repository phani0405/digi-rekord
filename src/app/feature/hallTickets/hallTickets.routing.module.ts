import { CONFIG } from './../../app.constant';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HallTicketsComponent } from './hallTickets.component';
import { ConfigComponent } from './config/config.component';
import { StudentsComponent } from './students/students.component';
import { AuthGuard } from '../../helpers/services/auth-guard.service';

const routes: Routes = [{
  path: '',
  component: HallTicketsComponent,
  children: [
    {
      path: CONFIG.ROUTES.HT_CONFIG,
      component: ConfigComponent,
      canActivate: [AuthGuard],
    },
    {
      path: CONFIG.ROUTES.HT_STUDENTS,
      component: StudentsComponent,
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
export class HallTicketsRoutingModule {

}

export const routedComponents = [
  HallTicketsComponent,
  ConfigComponent,
  StudentsComponent  
];
