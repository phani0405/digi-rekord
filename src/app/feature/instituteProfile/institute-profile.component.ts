import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { InstituteService } from '../../helpers/services/service';
import { CONFIG } from '../../app.constant';
import * as _ from 'underscore';
import { LoginUserService } from '../../helpers/services/service';

@Component({
  templateUrl: './institute-profile.component.html',
  styleUrls: ['./institute-profile.component.scss'],
  // providers: [InstituteService]
})
export class InstituteProfileComponent implements OnInit {
  _router: Router;
  listFilter= '';
  instituteDetail: any;
  url: string;
  model: any = {};
  loading = false;
  message: string;

    constructor(
        private router: Router,
        private modalService: NgbModal,
        private instituteService: InstituteService,
        private auth: LoginUserService,
    ) { }

    ngOnInit() {
        this.instituteService.getInstituteByUserId()
        .subscribe(
            institute => {
                if (institute) {
                    this.instituteDetail = institute[0];
                } else {
                }
            },
            error => {
                // this.alertService.error('Something went wrong, Please try again later');
                const errorData = this.auth.handleResponse(error);
                if (errorData) {
                    this.message = 'Something went wrong, Please try again later' ;
                    this.loading = false;
                }
            },
        );
    }

}

