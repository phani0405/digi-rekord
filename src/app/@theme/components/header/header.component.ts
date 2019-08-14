import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { AnalyticsService } from './../../utils/analytics.service';
import { CONFIG } from '../../../app.constant';
import { LoginUserService,AcademicYearsService,Broadcaster } from '../../../helpers/services/service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


  @Input() position = 'normal';

  user: any;
  currentAcademicYear: string;
  academicYears:string[];
  childrens: any[];
  selectedChildren: any;
  isShowChildDropdown: boolean = false

  userMenu = [{title: "Profile", link: '/private/prof'},{ title: 'Log out', link: '/login' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private analyticsService: AnalyticsService,
              private router: Router,
              private auth: LoginUserService,
              private academicYearService: AcademicYearsService,
              private broadcaster: Broadcaster
             ) {
  }

  ngOnInit() {
    this.getAcademicYears();
    this.setChild();
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  goToHome() {
    this.router.navigate([CONFIG.ROUTES.PRIVATE]);
    // this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }

  getAcademicYears(){
    console.log("Inside Academic Year")
    this.academicYearService.getAcademicYears().subscribe(
      data=>{
        if(data.academicYears){
          this.academicYears= data.academicYears;
          localStorage.setItem('academicYears', data.academicYears);
        }
        if(data.currentAcademicYear){
          this.currentAcademicYear= data.currentAcademicYear;
          localStorage.setItem('currentAcademicYear', data.currentAcademicYear);
        }
      }
    )    
  }

  updateCurrentAcademicYear(event: any){
    localStorage.setItem('currentAcademicYear', event);
  }
  
  setChild() {
    if(this.auth.userRole().toLocaleLowerCase() === 'parent') {
      this.childrens = this.auth.getParentsChild();
      const savedChild = this.auth.getSelectedChildren();
      if(savedChild) {
          const sChild = this.childrens.filter(s => {
              return s.studentID === savedChild.studentID
          });
          this.selectedChildren = sChild[0];
      } else {
          localStorage.setItem('selectedChildren', JSON.stringify(this.childrens[0]));
          this.selectedChildren = this.childrens[0];
      }
      console.log("this.selectedChildren", this.selectedChildren, this.childrens, savedChild)
      if(this.childrens.length > 1) {
        this.isShowChildDropdown = true;
      }
      this.showUserData();
    } else {
      console.log("log show user data", this.auth.userRole(), this.auth.registeredDetails());
      this.showUserData();
    }
  }

  showUserData() {
    this.user = {
      name: this.auth.getUserName(this.auth.userRole().toLocaleLowerCase()),
      picture: this.auth.getUserPicture(this.auth.userRole().toLocaleLowerCase()),
      sname: this.auth.getSName(this.auth.userRole().toLocaleLowerCase()),
      logo: this.auth.getLogo(this.auth.userRole().toLocaleLowerCase())
    };
  }

  onChangeChildren(student) {
    localStorage.setItem('selectedChildren', JSON.stringify(student));
    this.selectedChildren = student;
    this.showUserData();    
    this.showUserData();
    this.broadcaster.broadcast('onChangeSelectedChild', student);
  }
}
