import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu" class="hidden-print"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent {

    currentUser = localStorage.getItem('loggedInUser');
    user = JSON.parse(this.currentUser);
    role = this.user && this.user.userDetails ? this.user.userDetails.userRole.toLowerCase() : '';
    menus = this.role ? MENU_ITEMS[this.role] : MENU_ITEMS['default'];
    //menu = this.menus ? this.menus : MENU_ITEMS['default'];
    menu: any = [];
    ngOnInit(){      
      this.menu=[];
      this.setMenus();
    }
    setMenus(){
      let features=this.user && this.user.features ? this.user.features : [];
      if(this.role=="superadmin"){
        this.menu = this.menus ? this.menus : MENU_ITEMS['default'];
      }
      else{
        let mns=[];
        this.menus.forEach(function(item){
          var exists=features.find(x => x.featureID == item.featureID && x.selected == true);
          if(exists){
            mns.push(item);
          }
        });
        this.menu=mns;
      }
    }
}
