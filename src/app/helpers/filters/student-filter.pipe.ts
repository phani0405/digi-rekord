import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'StudentFilter'
})
export class StudentFilterPipe implements PipeTransform {

  transform(item: any[], searchText: string, items: any[]) {
    if (!items) {
        return [];
    }
    if (!searchText) {
        return item;
    } 
      searchText = searchText.toLowerCase();
      return items.filter( it => {
        if(it.className)
          return it.studentName.toLowerCase().includes(searchText) || it.studentRollNo.toLowerCase().includes(searchText) || it.className.toLowerCase().includes(searchText);
        else
          return it.studentName.toLowerCase().includes(searchText) || it.studentRollNo.toLowerCase().includes(searchText);
      });
   }

}
