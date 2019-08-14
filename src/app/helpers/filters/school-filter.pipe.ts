import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'SchoolFilter'
})
export class SchoolFilterPipe implements PipeTransform {

  transform(item: any[], searchText: string, items: any[]) {
    if (!items) {
        return [];
    }
    if (!searchText) {
        return item;
    }
      searchText = searchText.toLowerCase();
      return items.filter( it => {
        if(it.schoolName && it.schoolCode) {
          return it.schoolName.toLowerCase().includes(searchText) || it.schoolCode.toLowerCase().includes(searchText);
        } else {
          return;
        }
      
    });
   }

}