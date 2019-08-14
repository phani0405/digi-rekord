import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AcademicSetupService } from '../../helpers/services/service';
import { CONFIG } from '../../app.constant';
import * as _ from 'underscore';
import { filter } from 'rxjs/operator/filter';
import { LoginUserService } from '../../helpers/services/service';

@Component({
  templateUrl: './academicSetup.component.html',
})
export class AcademicSetupComponent {

    isRole: string;
    roles: any;
    constructor(private auth: LoginUserService) {

        this.isRole = this.auth.userRole();
        this.roles = CONFIG.ROLES;
    }
}

