// import { MarksCardComponent } from './marks-card/marks-card.component';
import { CONFIG } from './../../app.constant';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransportMgmtComponent } from './transport.component';
import { BusesComponent } from './buses/buses.component'
import { RoutesComponent } from './routes/routes.component';
import { AuthGuard } from '../../helpers/services/auth-guard.service';

const routes: Routes = [{
  path: '',
  component: TransportMgmtComponent,
  children: [
    {
      path: CONFIG.ROUTES.BUSES,
      component: BusesComponent,
      canActivate: [AuthGuard],
    },
    {
      path: CONFIG.ROUTES.ROUTES,
      component: RoutesComponent,
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
export class TransportMgmtRoutingModule {

}

export const routedComponents = [
  TransportMgmtComponent,
  RoutesComponent,
  BusesComponent,
];
