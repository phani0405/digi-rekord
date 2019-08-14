import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'districtFilter'
})
export class DistrictFilterPipe implements PipeTransform {
  transform(item: any[], searchText: string, items: any[]) {
    if (!searchText) {
        return item;
    }
    searchText = searchText.toLowerCase();
    var districts= [];
    items.forEach(function(state){
      if(state.stateName.toLowerCase().includes(searchText)){
        districts= state.districts;
      }
    });
    return districts;
   }

}
