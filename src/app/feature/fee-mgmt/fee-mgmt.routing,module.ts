import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CONFIG } from './../../app.constant';
import { FeeMgmtComponent } from './fee-mgmt.component';
import { FeeSetupComponent } from './fee-setup/fee-setup.component';
import { FeeAssignComponent } from './fee-assign/fee-assign.component';
import { FeeCollectComponent } from './fee-collect/fee-collect.component';
import { FeeReportComponent } from './fee-report/fee-report.component';
import { AuthGuard } from '../../helpers/services/auth-guard.service';

const routes: Routes = [{
  path: '',
  component: FeeMgmtComponent,
  children: [{
    path: CONFIG.ROUTES.FEE_SETUP,
    component: FeeSetupComponent,
    canActivate: [AuthGuard],
  }, {
    path: CONFIG.ROUTES.FEE_ASSIGNMENTS,
    component: FeeAssignComponent,
    canActivate: [AuthGuard],
  }, {
    path: CONFIG.ROUTES.FEE_COLLECTIONS,
    component: FeeCollectComponent,
    canActivate: [AuthGuard],
  }, {
    path: CONFIG.ROUTES.FEE_REPORTS,
    component: FeeReportComponent,
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
export class FeeMgmtRoutingModule {

}

export const routedComponents = [
    FeeMgmtComponent,
    FeeSetupComponent,
    FeeAssignComponent,
    FeeCollectComponent,
    FeeReportComponent
];
