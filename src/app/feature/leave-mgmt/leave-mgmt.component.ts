import { Component } from '@angular/core';
import { CONFIG } from '../../app.constant';
import { LoginUserService } from '../../helpers/services/service';

@Component({
  selector: 'app-my-leave',
  template: `
    <app-leave-list leaveType="MyLeaves"></app-leave-list>
  `,
})
export class MyLeavesComponent { }

@Component({
  selector: 'app-leave-for-approval',
  template: `
    <app-leave-list leaveType="LeaveForApproval"></app-leave-list>
  `,
})
export class LeavesForApprovalComponent { }

@Component({
  selector: 'app-leave-mgmt',
  templateUrl: './leave-mgmt.component.html',
})

export class LeaveMgmtComponent {

  tabs: any[] = [];
  myLeaves = {
    title: 'My Leaves',
    route: 'private/' + CONFIG.ROUTES.LEAVE_MGMT + '/' + CONFIG.ROUTES.MY_LEAVES,
  }
  leaveForApproval = {
      title: 'Leaves For Approve',
      route: 'private/' + CONFIG.ROUTES.LEAVE_MGMT + '/' + CONFIG.ROUTES.LEAVES_FOR_APPROVE,
    };

    constructor(private auth: LoginUserService) {
    
    const role = this.auth.userRole().toLocaleLowerCase();
    const staffRole= this.auth.staffRole().toLocaleLowerCase();
    if (role === 'parent' || role === 'nonteachingstaff' || role === 'teachingstaff') {
      this.tabs.push(this.myLeaves)
    }
    if (staffRole === 'principal' || role === 'teachingstaff') {
      this.tabs.push(this.leaveForApproval)
    }
    }

}
