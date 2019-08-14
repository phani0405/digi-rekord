import { NgModule } from '@angular/core';
import { SearchFilterPipe, OrderByPipe } from '../filters/filter';
import { StudentFilterPipe } from './student-filter.pipe';
import { DistrictFilterPipe } from './district-filter.pipe';

@NgModule({

    imports: [
      // dep modules
    ],
    declarations: [
        SearchFilterPipe,
        OrderByPipe,
        StudentFilterPipe,
        DistrictFilterPipe,
    ],
    exports: [
        SearchFilterPipe,
        OrderByPipe,
        StudentFilterPipe,
        DistrictFilterPipe,
    ],
})

export class ApplicationPipesModule { }
