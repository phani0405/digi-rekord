import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../@theme/theme.module';
import { CreateGalleryComponent } from './create/create.component';
import { GalleryListComponent } from './gallery-list/gallery-list.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    ThemeModule,
  ],
  declarations: [GalleryListComponent, CreateGalleryComponent],
  
})
export class GalleryModule { }
