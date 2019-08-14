import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import {
  LoginUserService, GalleryMgmtService, AchievementMgmtService, DashboardService,
  StudentMgmtService, Broadcaster, InstituteService
} from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import { Util } from '../../../helpers/util';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
/**
 *
 */
@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './details.component.html'
})
export class DashboardDetailsComponent implements OnInit, OnDestroy {
  model: any = {
  };
  loading = false;
  isInstituteAdminUser = false;
  isSchoolAdminUser = false;
  isPrincipalUser = false;
  isParentUser = false;
  isTeachingStaffUser = false;
  childrenUpdateEvent: any;
  showFees: boolean = false;

  constructor(
    private auth: LoginUserService,
    private dashboardService: DashboardService,
    private achievementService: AchievementMgmtService,
    private studentMgmtService: StudentMgmtService,
    private broadcaster: Broadcaster,    
    private instituteService: InstituteService,
    public util: Util,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    private router: Router
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.checkUserAccess();
      let features=this.auth.features();
      var fexists=features.find(x => x.featureID == 'DiGiF17' && x.selected == true);
      if(fexists){
          this.showFees=true;
      }
  }

  feeReportsPage= function () {
      this.router.navigateByUrl('/private/reports/fee');
  };
  studentsPage= function () {
    if(this.auth.userRole().toLocaleLowerCase()==='schooladmin')
      this.router.navigateByUrl('/private/student');
  };
  staffPage= function () {
    if(this.auth.userRole().toLocaleLowerCase()==='schooladmin')
      this.router.navigateByUrl('/private/staff/Yes');
  };
  timelinePage= function () {
      this.router.navigateByUrl('/private/timeline');
  };
  checkUserAccess() {
    const role = this.auth.userRole().toLocaleLowerCase();
    switch (role) {
      case 'instituteadmin':
        {
          this.getSchoolCountCountForInstituteAdmin();
          this.getStudentCountForInstituteAdmin();
          this.getStaffCountForInstituteAdmin();
          this.getSmsCountForInstituteAdmin();
          this.isInstituteAdminUser = true;
        }
        break;
      case 'schooladmin':
        {
          this.getStudentCount();
          this.getStaffCount();
          this.getSmsCount();
          this.getMsgCount();
          this.getFeeDetails();
          this.isSchoolAdminUser = true;
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
            .subscribe(message => {
              console.log("event fire")
              this.getStudentDetail();
            });
          this.getStudentDetail();
          this.isParentUser = true;
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
          this.model.classTeacherDetails = detail[0].classTeacherDetails;
          this.model.subjects = detail[0].subjects;
          this.isTeachingStaffUser = true;
        }
        break;
      case 'principal':
        {
          this.getStudentCount();
          this.getStaffCount();
          this.getSmsCount();
          this.getMsgCount();
          this.getFeeDetails();
          this.isPrincipalUser = true;
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
    this.studentMgmtService.getStudentDetail(studentID)
      .subscribe(
      student => {
        if (student || !student.error) {
          this.model.studentDetail = student[0].student;
        } else {
        }
      },
      error => {
        this.auth.handleResponse(error);
      },
    );
  }

  getSchoolCountCountForInstituteAdmin() {
    const InstituteId = this.auth.getInstituteID();
    this.dashboardService.getWidgetForInstituteAdmin(InstituteId, 'schools')
      .subscribe(
      school => {
        if (school || !school.error) {
          this.model.schoolCount = school.count + ' Schools'
        } else {
        }
      },
      error => {
      });
  }

  getStudentCountForInstituteAdmin() {
    const InstituteId = this.auth.getInstituteID();
    this.dashboardService.getWidgetForInstituteAdmin(InstituteId, 'students')
      .subscribe(
      student => {
        if (student || !student.error) {
          this.model.studentCount = student.count + ' Students'
        } else {
        }
      },
      error => {
      });
  }

  getStaffCountForInstituteAdmin() {
    const InstituteId = this.auth.getInstituteID();
    this.dashboardService.getWidgetForInstituteAdmin(InstituteId, 'staffs')
      .subscribe(
      staff => {
        if (staff || !staff.error) {
          this.model.staffCount = staff.count + ' Staff'
        } else {
        }
      },
      error => {
      });
  }

  getSmsCountForInstituteAdmin() {
    const InstituteId = this.auth.getInstituteID();
    this.dashboardService.getWidgetForInstituteAdmin(InstituteId, 'messages')
      .subscribe(
      msg => {
        if (msg || !msg.error) {
          this.model.msgCount = msg.count + ' Messages'
        } else {
        }
      },
      error => {
      });
  }

  getStudentCount() {
    const schoolId = this.auth.getSchoolID();
    this.dashboardService.getWidgetForSchoolAdmin(schoolId, 'students')
      .subscribe(
      student => {
        if (student || !student.error) {
          this.model.studentCount = student.count + ' Students'
        } else {
        }
      },
      error => {
      });
  }

  getStaffCount() {
    const schoolId = this.auth.getSchoolID();
    this.dashboardService.getWidgetForSchoolAdmin(schoolId, 'staffs')
      .subscribe(
      staff => {
        if (staff || !staff.error) {
          this.model.staffCount = staff.count + ' Staff'
        } else {
        }
      },
      error => {
      });
  }

  getMsgCount() {
    const schoolId = this.auth.getSchoolID();
    this.dashboardService.getWidgetForSchoolAdmin(schoolId, 'messages')
      .subscribe(
      msg => {
        if (msg || !msg.error) {
          this.model.msgCount = msg.count + ' Messages'
        } else {
        }
      },
      error => {
      });
  }

  getSmsCount() {
    const InstituteId = this.auth.instituteID();
    console.log(InstituteId);
    this.instituteService.getInstituteByUserId(InstituteId)
      .subscribe(
      sms => {
        if (sms || !sms.error) {
          // console.log('Instite Data');
          // console.log(sms);
          this.model.smsCount = 'Balance: '+ sms[0].smsBalanceCredits + ' Used: ' + sms[0].smsUsedCredits
        } else {
        }
      },
      error => {
      });
  }

  getFeeDetails() {
    const schoolId = this.auth.getSchoolID();
    this.dashboardService.getFeeDetails(schoolId, 'students')
      .subscribe(
      fee => {
        if (fee || !fee.error) {
          this.model.feeDetails={};
          this.model.feeDetails.totalFee = 'Total: Rs.'+ fee.totalFee+'/-';
          let collectedFee=fee.totalFee-fee.balanceFee;
          this.model.feeDetails.collectedFee = 'Collected: Rs.'+ collectedFee +'/-';
          this.model.feeDetails.balanceFee = 'Due: Rs.'+ fee.balanceFee+'/-';
        } else {
        }
      },
      error => {
      });
  }

  ngOnDestroy() {
    if (this.childrenUpdateEvent) {
      this.childrenUpdateEvent.unsubscribe();
    }
  }
}