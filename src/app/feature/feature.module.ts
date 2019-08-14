
// import { BrowserModule } from '@angular/platform-browser

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { PagesComponent } from './pages.component';
import { CommonModule } from '@angular/common';
import { DashboardModule, InstituteMgmtModule, SchoolMgmtModule, AcademicSetupModule,
  StudentMgmtModule, TimelineModule, LeaveMgmtModule, GalleryModule, AchievementModule, HallTicketsModule, CustomSMSModule, ReportsModule, FeeMgmtModule } from './index';
import { ThemeModule } from '../@theme/theme.module';
import { PagesRoutingModule } from './pages-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { InstituteProfileComponent } from './instituteProfile/institute-profile.component';
import { HighlightDirective } from '../helpers/directives/highlight.directive';
import { Institute } from '../helpers/models/institute';
import { StaffMgmtService, GalleryMgmtService, AchievementMgmtService, StudentMgmtService, ProfileService, CustomSMSMgmtService, FeeService } from '../helpers/services/service';
import { UploadService } from '../helpers/services/upload-file.service';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { CONFIG } from '../app.constant';
import { environment } from '../../environments/environment';
import { UserProfileComponent } from './user-profile/user-profile.component';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DashboardModule,
    InstituteMgmtModule,
    SchoolMgmtModule,
    PagesRoutingModule,
    Ng2SmartTableModule,
    AcademicSetupModule,
    StudentMgmtModule,
    TimelineModule,
    LeaveMgmtModule,
    AngularFireModule.initializeApp(environment.FIREBASE),
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey
    }),
    AngularFireDatabaseModule,
    GalleryModule,
    AchievementModule,
    CustomSMSModule,
    ReportsModule,
    FeeMgmtModule
  ],  
  declarations: [
    ...PAGES_COMPONENTS, InstituteProfileComponent, HighlightDirective, UserProfileComponent,
  ],
  providers: [Institute, StaffMgmtService, UploadService, GalleryMgmtService, AchievementMgmtService, StudentMgmtService, ProfileService, CustomSMSMgmtService, FeeService],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class PagesModule {
}
