import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../@theme/theme.module';
import { CreateAchievementComponent } from './create/create.component';
import { AchievementListComponent } from './achievement-list/achievement-list.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    ThemeModule,
  ],
  declarations: [AchievementListComponent, CreateAchievementComponent],
})
export class AchievementModule { }
