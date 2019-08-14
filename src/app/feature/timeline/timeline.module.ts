import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../@theme/theme.module';
import { ComposeComponent } from './compose/compose.component';
import { FeedComponent } from './feed/feed.component';
import { TimelineMgmtService, SchoolMgmtService} from '../../helpers/services/service';
import { FileUploaderModule } from 'ng4-file-upload/file-uploader.module';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    ThemeModule,
    FileUploaderModule,
  ],
  declarations: [ComposeComponent, FeedComponent],
  providers: [TimelineMgmtService, SchoolMgmtService]
})
export class TimelineModule { }
