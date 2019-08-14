import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'SearchFilter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(item: any[], searchText: string, items: any[]) {
    if (!items) {
        return [];
    }
    if (!searchText) {
        return item;
    }
      searchText = searchText.toLowerCase();
      return items.filter( it => {
      return it.staffName.toLowerCase().includes(searchText) || it.userID.toLowerCase().includes(searchText);
    });
   }
}
