import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { LoginUserService } from '../../helpers/services/service';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  model: any = {
  };
  loading = false;
  isGalleryAccess = false;
  isChartAccess = false;
  isInstituteAdminUser = false;

  constructor(private auth: LoginUserService, ) {

  }

  ngOnInit() {
    this.checkUserAccess();
  }

  checkUserAccess() {
    const role = this.auth.userRole().toLocaleLowerCase();
    switch (role) {
      case 'instituteadmin':
        {
          this.isInstituteAdminUser = true;
          this.isGalleryAccess = false;
          this.isChartAccess = true;
        }
        break;
      case 'schooladmin':
        {
          this.isGalleryAccess = true;
          this.isChartAccess = true;
        }
        break;
      case 'teachingstaff':
        {
          this.checkRolesForTeachingStaff()
        }
        break;
      case 'nonteachingstaff':
        {
          this.isGalleryAccess = true;
          this.isChartAccess = false;
        }
        break;
      case 'parent':
        {
          this.isGalleryAccess = true;
          this.isChartAccess = true;
        }
        break;
    }
  }

  checkRolesForTeachingStaff() {
    const detail = this.auth.registeredDetails();
    const role = detail && detail[0] &&
      detail[0].staffRole ? detail[0].staffRole.toLocaleLowerCase() : '';

    switch (role) {
      case 'staff':
        {
          this.isGalleryAccess = true;
          this.isChartAccess = false;
        }
        break;
      case 'principal':
        {
          this.isGalleryAccess = true;
          this.isChartAccess = true;
        }
        break;
      default:
        this.isGalleryAccess = true;
    }
  }

}
