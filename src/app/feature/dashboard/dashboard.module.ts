import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardGalleryComponent } from './gallery/gallery.component'
import { DashboardDetailsComponent } from './details/details.component'
import { StatusCardComponent } from './details/status-card/status-card.component'
import { DashboardService } from '../../helpers/services/service'
import { ChartModule } from 'angular2-chartjs';
import { ChartjsComponent } from './charts/chartjs.component'
import { ChartjsPieComponent } from './charts/chartjs-pie.component'
import { ChartjsBarComponent } from './charts/chartjs-bar.component'

@NgModule({
  imports: [
    ThemeModule,
    ChartModule,
  ],
  declarations: [
    DashboardComponent,
    DashboardGalleryComponent,
    DashboardDetailsComponent,
    ChartjsComponent,
    ChartjsPieComponent,
    ChartjsBarComponent,
    StatusCardComponent
  ],
  providers: [DashboardService]
})
export class DashboardModule { }
