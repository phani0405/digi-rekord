import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { LoginUserService, SchoolMgmtService, Broadcaster } from '../../../helpers/services/service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-chartjs',
  styleUrls: ['./chartjs.component.scss'],
  templateUrl: './chartjs.component.html',
})

export class ChartjsComponent implements OnInit {
  model: any = {
  };
  loading = false;
  isAccessDropDownHeader = false;
  schools: any;

  constructor(
    private auth: LoginUserService,
    private schoolMgmtService: SchoolMgmtService,
    private broadcaster: Broadcaster,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.checkUserAccess();
  }

  attendanceReportsPage= function () {
      this.router.navigateByUrl('/private/reports/attendance');
  };

  checkUserAccess() {
    const role = this.auth.userRole().toLocaleLowerCase();
    switch (role) {
      case 'instituteadmin':
        {
          this.isAccessDropDownHeader = true;
          this.getSchools();
        }
        break;
      default:
        {
          this.isAccessDropDownHeader = false;
        }
        break;
    }
  }

  getSchools() {
    this.schoolMgmtService.getSchool()
      .subscribe(
      schools => {
        if (schools) {
          this.schools = schools.sort(function (a, b) {
            return (a.createdDate < b.createdDate) ? 1 : ((b.createdDate < a.createdDate) ? -1 : 0);
          });
        } else {
        }
      },
    );
  }

  onChangeSchool(school, chartType) {
    console.log('school', school);
    if (chartType === 'bar') {
      this.broadcaster.broadcast('onChangeBarChartSchool', school);
    }
    if (chartType === 'pie') {
      this.broadcaster.broadcast('onChangePieChartSchool', school);
    }
  }
}
