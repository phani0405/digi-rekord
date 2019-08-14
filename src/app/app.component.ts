import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsService } from './@theme/utils/analytics.service';
import { CONFIG } from './app.constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = CONFIG.MSG.appTitle;
  constructor(private analytics: AnalyticsService, private router:Router) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    console.log(window.location.hash)
    if(window.location.hash==="" || window.location.hash==="/" || window.location.hash==="#" || window.location.hash==="#/" || window.location.hash==="/#" || window.location.hash==="/#/"){
      this.router.navigateByUrl('/login');
    }
  }
}
