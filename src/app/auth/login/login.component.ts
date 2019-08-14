import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONFIG } from '../../app.constant';
import { AlertService, AuthenticationService, InstituteService, LoginUserService } from './../../helpers/services/service';

@Component({
    moduleId: module.id,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [AuthenticationService, AlertService],
})
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private instituteService: InstituteService,
        private auth: LoginUserService
    ) { }

    ngOnInit() {
        // reset login status
        this.auth.logout()
        // this.authenticationService.logout();
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
            data => {
                if (data.message !== 'invalid credentials' && !data.error) {
                    if(data.userDetails.userRole=="superAdmin"){
                        data.features=[];
                        localStorage.setItem('loggedInUser', JSON.stringify(data));
                        this.router.navigate([CONFIG.ROUTES.PRIVATE]);
                    }
                    else if(data.userDetails.userRole=="parent"){
                        localStorage.setItem('loggedInUser', JSON.stringify(data));
                        this.getFeatures(data.registeredDetails[0].studentIDs[0].instituteID);
                        localStorage.setItem('timeZone', JSON.stringify(data.registeredDetails[0].studentIDs[0].timeZone[0]));
                    }
                    else{
                        localStorage.setItem('loggedInUser', JSON.stringify(data));
                        this.getFeatures(data.registeredDetails[0].instituteID);
                        localStorage.setItem('timeZone', JSON.stringify(data.registeredDetails[0].timeZone[0]));
                    }
                    //this.router.navigate([CONFIG.ROUTES.PRIVATE]);
                } else {
                    this.alertService.error('Invalid username and password');
                    this.loading = false;
                }
            },
            error => {
                this.alertService.error('Something went wrong, Please try again later');
                this.loading = false;
            });
    }
    getFeatures(instituteID) {
        this.loading = true;
        this.instituteService.getInstituteByUserId(instituteID)
            .subscribe(
            data => {
                if (data) {
                    var userData=JSON.parse(localStorage.getItem('loggedInUser'));
                    userData.features=data[0].features;
                    localStorage.setItem('loggedInUser', JSON.stringify(userData));                    
                    this.router.navigate([CONFIG.ROUTES.PRIVATE]);
                } else {
                    this.alertService.error('Error!');
                    this.loading = false;
                }
            },
            error => {
                this.alertService.error('Something went wrong, Please try again later');
                this.loading = false;
            });
    }
}
