import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../@theme/theme.module';
import { CreateSMSComponent } from './create/create.component';
import { SMSListComponent } from './sms-list/sms-list.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    ThemeModule,
  ],
  declarations: [SMSListComponent, CreateSMSComponent],
  
})
export class CustomSMSModule { }
