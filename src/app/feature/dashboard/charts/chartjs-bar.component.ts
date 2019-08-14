import { Component, ViewContainerRef, OnDestroy, Input, OnInit } from '@angular/core';
import {
  LoginUserService, DashboardService,
  StudentMgmtService, Broadcaster
} from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import { Util } from '../../../helpers/util';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as _ from 'underscore';
import { NbThemeService, NbColorHelper } from '@nebular/theme';

@Component({
  selector: 'app-dashboard-chartjs-bar',
  template: `
    <chart type="bar" [data]="data" [options]="options"></chart>
  `,
})
export class ChartjsBarComponent implements OnDestroy, OnInit {
  data: any;
  options: any;
  themeSubscription: any;
  colors: any
  schoolIdUpdateEvent: any;
  childrenUpdateEvent: any;

  constructor(private auth: LoginUserService,
    private dashboardService: DashboardService,
    private broadcaster: Broadcaster,
    public util: Util,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    private theme: NbThemeService
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      this.colors = config.variables;
      const chartjs: any = config.variables.chartjs;

      this.options = {
        maintainAspectRatio: false,
        responsive: true,
        scaleStartValue: 0,
        legend: {
          labels: {
            fontColor: chartjs.textColor,
          },
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
        },
      };
    });
  }

  ngOnInit() {
    this.checkUserAccess()
  }

  parseResponseForBarChart(res) {
    const labels = [];
    const present = [];
    const absent = [];
    if (res.monthWiseDetails) {
      const currentYear = (new Date().getFullYear()) - 1;

      // const modifyData = res.monthWiseDetails.map((i) => {
      //   if (i.year === null) {
      //     i.year = currentYear
      //   }
      //   return i;
      // })
      // console.log(modifyData);
      // const mData = modifyData.sort((a, b) => {
      //   const d = new Date(b.year, b.month - 1);
      //   const c = new Date(a.year, a.month - 1);
      //   return (d > c) ? 1 : ((d < c) ? -1 : 0);
      // });
      // console.log(mData);
      const mData=res.monthWiseDetails;
      mData.forEach(element => {
        present.push(element.daysPresent || 0)
        absent.push(element.daysAbsent || 0)
        var mm=element.year?("-"+element.year):"";
        switch (element.month) {
          case 1:
            labels.push("Jan"+mm)
            break;
          case 2:
            labels.push("Feb"+mm)
            break;
          case 3:
            labels.push("Mar"+mm)
            break;
          case 4:
            labels.push("Apr"+mm)
            break;
          case 5:
            labels.push("May"+mm)
            break;
          case 6:
            labels.push("Jun"+mm)
            break;
          case 7:
            labels.push("Jul"+mm)
            break;
          case 8:
            labels.push("Aug"+mm)
            break;
          case 9:
            labels.push("Sep"+mm)
            break;
          case 10:
            labels.push("Oct"+mm)
            break;
          case 11:
            labels.push("Nov"+mm)
            break;
          case 12:
            labels.push("Dec"+mm)
            break;
        }
      });
      this.data = {
        labels: labels,
        datasets: [{
          data: present,
          label: 'Present',
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.successLight, 1),
        }, {
          data: absent,
          label: 'Absent',
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.danger, 1),
        }],
      };
    }
  }

  checkUserAccess() {
    const role = this.auth.userRole().toLocaleLowerCase();
    switch (role) {
      case 'instituteadmin':
        {
          this.schoolIdUpdateEvent = this.broadcaster.on<string>('onChangeBarChartSchool')
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
    this.getAttendanceReportForParent(studentID)
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
        label: 'Present',
      }, {
        label: 'Absent',
      }],
    };
  }

  getAttendanceReportForParent(studentId) {
    this.dashboardService.getMonthWiseAttendanceForParent(this.auth.getSchoolID(), studentId)
      .subscribe(
      res => {
        if (res && !(res.error || res.message)) {
          this.parseResponseForBarChart(res)
        } else {
          this.resetChart()
          this.toastr.warning("No Attendance Details found for this school")
        }
      },
      error => {
      });
  }

  getAttendanceReport(schoolId) {
    this.dashboardService.getMonthWiseAttendance(schoolId)
      .subscribe(
      res => {
        if (res && !(res.error || res.message)) {
          this.parseResponseForBarChart(res)
        } else {
          this.resetChart()
          this.toastr.warning("No Attendance Details found for this school")
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
