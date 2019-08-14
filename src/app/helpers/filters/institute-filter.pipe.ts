import { Pipe, PipeTransform } from '@angular/core';
import { iInstitute } from '../interfaces/iinstitute';

@Pipe({
  name: 'instituteFilter'
})
export class InstituteFilterPipe implements PipeTransform {

  transform(item: any[], searchText: string, items: any[]) {
    if (!items) {
        return [];
    }
    if (!searchText) {
        return item;
    }
      searchText = searchText.toLowerCase();
      return items.filter( it => {
        if(it.instituteName && it.instituteCode) {
          return it.instituteName.toLowerCase().includes(searchText) || it.instituteCode.toLowerCase().includes(searchText);
        } else {
          return;
        }
      
    });
   }

}
