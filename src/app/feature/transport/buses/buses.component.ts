import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoginUserService, AlertService, MarksMgmtService, SchoolMgmtService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';

import { filter } from 'rxjs/operator/filter';

@Component({
  selector: 'app-transport-buses',
  templateUrl: './buses.component.html',
  styleUrls: ['./buses.component.scss']
})
export class BusesComponent implements OnInit {

    lat: number;
    lng: number;
    iconUrl: string;
   
    zoom: Number = 13;
   
    dir = undefined;
    latlngs = undefined;

    constructor() { }
    ngOnInit() {
      this.getUserLocation()
      this.getDirection()
      this.getBuses()
      this.zoom=13
    }
    private getUserLocation() {
     /// locate the user
     if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {          
         this.lat = position.coords.latitude;
         this.lng = position.coords.longitude;
         this.iconUrl="assets/images/bus.png";
       });
     }
   }
   private getBuses() {
      this.latlngs = [{
         lat: 12.9172, 
         lng: 77.6228,
         iconUrl: "assets/images/bus.png",
         bus:"Bus 1",
         bus_number: "AP26 AB 1111",         
         driver_name: "Subba rao",
         driver_no: "8986547890"
      },{
         lat: 12.9081357, 
         lng: 77.64760799999999,
         iconUrl: "assets/images/bus.png",
         bus:"Bus 2",
         bus_number: "AP26 AB 2222",         
         driver_name: "Srinivasulu",
         driver_no: "8097867324"
      },{
         lat: 12.9165757, 
         lng: 77.61011630000007,
         iconUrl: "assets/images/bus.png",
         bus:"Bus 3",
         bus_number: "AP26 AB 3333",         
         driver_name: "Venkatesh",
         driver_no: "8773267826"
      }
      ]
    }
    private getDirection() {
      this.dir = [{
        origin: { lat: 12.9081357, lng: 77.64760799999999 },
        destination: { lat: 12.9591722, lng: 77.69741899999997 }
      },{
        origin: { lat: 12.9081357, lng: 77.64760799999999 },
        destination: { lat: 12.9165757, lng: 77.61011630000007 }
      },{
        origin: { lat: 12.9081357, lng: 77.64760799999999 },
        destination: { lat: 12.934533, lng: 77.626579 }
      }
    ]
  }
}
