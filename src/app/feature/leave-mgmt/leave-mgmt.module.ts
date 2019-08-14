import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../@theme/theme.module';
import { LeaveListComponent } from './leave-list/leave-list.component';
import { ApplyComponent } from './apply/apply.component';
import { LeaveMgmtService } from '../../helpers/services/leave-mgmt.service'
import { LeaveMgmtComponent, MyLeavesComponent, LeavesForApprovalComponent } from './leave-mgmt.component'




@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    ThemeModule
  ],
  declarations: [LeaveListComponent, ApplyComponent, LeaveMgmtComponent, MyLeavesComponent, LeavesForApprovalComponent],
  providers: [LeaveMgmtService]
})
export class LeaveMgmtModule { }
