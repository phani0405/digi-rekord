import { MarksCardComponent } from './marks-card/marks-card.component';
import { CONFIG } from './../../app.constant';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarksMgmtComponent } from './marks.component';
import { MarksRemarkComponent } from './remarks/remarks.component'
import { MarksDivisionComponent } from './division/division.component';
import { MarksSubmitComponent } from './marks-submit/marks-submit.component'
import { AuthGuard } from '../../helpers/services/auth-guard.service';

const routes: Routes = [{
  path: '',
  component: MarksMgmtComponent,
  children: [
    {
      path: CONFIG.ROUTES.MARKS_CARD,
      component: MarksCardComponent,
      canActivate: [AuthGuard],
    },
    {
      path: CONFIG.ROUTES.STUDENT_REMARKS,
      component: MarksRemarkComponent,
      canActivate: [AuthGuard],
    },
    {
      path: CONFIG.ROUTES.SUBJECT_DIVISION,
      component: MarksDivisionComponent,
      canActivate: [AuthGuard],
    },
    {
      path: CONFIG.ROUTES.STUDENT_MARKS,
      component: MarksSubmitComponent,
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
export class MarksMgmtRoutingModule {

}

export const routedComponents = [
  MarksMgmtComponent,
  MarksCardComponent,
  MarksRemarkComponent,
  MarksDivisionComponent,
  MarksSubmitComponent,
  
];
