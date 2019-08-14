import { Component, ViewContainerRef, OnDestroy, Input, OnInit } from '@angular/core';
import {
  LoginUserService, DashboardService,
  StudentMgmtService, Broadcaster
} from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import { Util } from '../../../helpers/util';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as _ from 'underscore';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'app-dashboard-chartjs-pie',
  template: `
    <chart type="pie" [data]="data" [options]="options"></chart>
  `,
})
export class ChartjsPieComponent implements OnDestroy, OnInit {
  data: any;
  options: any;
  themeSubscription: any;
  colors: any;
  @Input() schoolID: string;
  childrenUpdateEvent: any;
  schoolIdUpdateEvent: any;
  isParentUser = false;

  constructor(
    private auth: LoginUserService,
    private dashboardService: DashboardService,
    private broadcaster: Broadcaster,
    public util: Util,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    private theme: NbThemeService,
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      this.colors = config.variables;
      const chartjs: any = config.variables.chartjs;
      this.options = {
        maintainAspectRatio: false,
        responsive: true,
        scale: {
          pointLabels: {
            fontSize: 14,
            fontColor: chartjs.textColor,
          },
        },
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
        legend: {
          labels: {
            fontColor: chartjs.textColor,
          },
        },
      };
    });
  }

  ngOnInit() {
    this.checkUserAccess();
  }

  checkUserAccess() {
    const role = this.auth.userRole().toLocaleLowerCase();
    switch (role) {
      case 'instituteadmin':
        {
          this.schoolIdUpdateEvent = this.broadcaster.on<string>('onChangePieChartSchool')
            .subscribe(schoolID => {
              console.log("event fire", schoolID)
              this.getAttendanceReport(schoolID);
            });
        }
        break;
      case 'schooladmin':
        {
          this.getAttendanceReport(this.auth.getSchoolID());
        }
        break;
      case 'teachingstaff':
        {
          this.checkRolesForTeachingStaff()
        }
        break;
      case 'parent':
        {
          this.childrenUpdateEvent = this.broadcaster.on<string>('onChangeSelectedChild')
            .subscribe(studentId => {
              this.getStudentDetail()
              console.log("event fire")
            });
          this.getStudentDetail()
          this.isParentUser = true;
        }
        break;
    }
  }

  getStudentDetail() {
    let studentID;
    if (this.auth.getSelectedChildren()) {
      studentID = this.auth.getSelectedChildren().studentID
    } else {
      studentID = this.auth.getParentsChild()[0].studentID
    }
    this.dashboardService.getTotalAttendanceForParent(this.auth.getSchoolID(), studentID)
      .subscribe(
      res => {
        if (res && !res.error) {
          this.parseResponseForPiChart(res)
        } else {
          this.resetChart()
          this.toastr.warning("No Attendance Details found for this school")
        }
      },
      error => {
      });
  }

  checkRolesForTeachingStaff() {
    const detail = this.auth.registeredDetails();
    const role = detail && detail[0] &&
      detail[0].staffRole ? detail[0].staffRole.toLocaleLowerCase() : '';

    switch (role) {
      case 'staff':
        {
        }
        break;
      case 'principal':
        {
          this.getAttendanceReport(this.auth.getSchoolID());
        }
        break;
    }
  }

  resetChart() {
    this.data = {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
      }],
    };
  }

  parseResponseForPiChart(res) {
    if (res.length > 0) {
      this.data = {
        labels: ['Present', 'Absent'],
        datasets: [{
          data: [res[0].daysPresent, res[0].daysAbsent],
          backgroundColor: [this.colors.successLight, this.colors.danger],
        }],
      };
    } else {
      this.resetChart()
      this.toastr.warning("No Attendance Details found for this school")
    }
  }

  getAttendanceReport(schoolId) {
    this.dashboardService.getTotalAttendance(schoolId)
      .subscribe(
      resp => {
        if (resp && !resp.error) {
          this.parseResponseForPiChart(resp)
        } else {
        }
      },
      error => {
      });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
    if (this.childrenUpdateEvent) {
      this.childrenUpdateEvent.unsubscribe();
    }
    if (this.schoolIdUpdateEvent) {
      this.schoolIdUpdateEvent.unsubscribe();
    }
  }
}
