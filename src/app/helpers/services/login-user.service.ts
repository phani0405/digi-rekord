import { Injectable } from '@angular/core';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import * as _ from 'underscore';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { CONFIG } from '../../app.constant';
// import decode from 'jwt-decode';

@Injectable()
export class LoginUserService {

    _classDetail: any;
    _subjectDetail: any;
    _schoolDetail: any;
    _termDetail: any;

    constructor(private router: Router) {

    }

    apiKey(): string {
        const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
        return currentUser.apiKey;
    }

    currentAcademicYear(): string {
        return localStorage.getItem('currentAcademicYear');
    }

    academicYears(): any {
        return localStorage.getItem('academicYears');
    }

    userId(): string {
        const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const userDetails = currentUser && currentUser.userDetails ? currentUser.userDetails : '';
        const userId = userDetails && currentUser.userDetails.userID ? currentUser.userDetails.userID : '';
        return userId;
    }

    userRole(): string {
        const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const userDetails = currentUser && currentUser.userDetails ? currentUser.userDetails : '';
        const userRole = userDetails && currentUser.userDetails.userRole ? currentUser.userDetails.userRole : '';
        return userRole;
    }

    staffRole(): string {
        const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const registeredDetails = currentUser && currentUser.registeredDetails ? currentUser.registeredDetails : '';
        const staffRole = registeredDetails[0] && registeredDetails[0].staffRole ? registeredDetails[0].staffRole : '';
        return staffRole;
    }

    registeredDetails(): any {
        const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
        return currentUser.registeredDetails;
    }

    instituteID(): any {
        const data = JSON.parse(localStorage.getItem('loggedInUser'));
        //return data.registeredDetails;
        if(data.userDetails.userRole=="parent"){
            return data.registeredDetails[0].studentIDs[0].instituteID;
        }
        else{
            return data.registeredDetails[0].instituteID;
        }
    }

    loggedIn() {
        return this.apiKey();
    }

    features(): any {
        const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const features = currentUser && currentUser.features ? currentUser.features : [];
        return features;
    }

    timeZone(): any {
        const timeZone = JSON.parse(localStorage.getItem('timeZone'));
        return timeZone;
    }

    getLocalDate(dt): any {
        //console.log(new Date(dt));
        // const timeZone = JSON.parse(localStorage.getItem('timeZone'));
        // if(timeZone.symbol==='+')
        //     return new Date(new Date(dt).getTime() + (timeZone.zoneTime.split(':')[0]*60*60000+timeZone.zoneTime.split(':')[1]*60000));
        // else
        //     return new Date(new Date(dt).getTime() - (timeZone.zoneTime.split(':')[0]*60*60000+timeZone.zoneTime.split(':')[1]*60000));
        return new Date(dt);
    }

    handleResponse(response: Response) {
        if (response.status === 401) {
            this.logout();
        } else {
            return response;
        }
    }

    logout() {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('selectedChildren');
        this.destroyStoreData();
        this.router.navigate([CONFIG.ROUTES.LOGIN]);
    }

    public getToken(): string {
        return localStorage.getItem('token');
    }

    public isAuthenticated(): boolean {
        // get the token
        const token = this.getToken();
        // return a boolean reflecting
        // whether or not the token is expired
        return true;
    }

    set subjectDetail(data) {
        this._subjectDetail = data;
    }

    set classDetail(data) {
        this._classDetail = data;
    }

    get subjectDetail(): any {
        return this._subjectDetail;
    }

    get classDetail(): any {
        return this._classDetail;
    }

    set schoolDetail(data) {
        this._schoolDetail = data;
    }

    get schoolDetail(): any {
        return this._schoolDetail;
    }

    set termDetail(data) {
        this._termDetail = data;
    }

    get termDetail(): any {
        return this._termDetail;
    }

    formateDateIntoString(dateObject): string {
        const date = new Date(dateObject.year, dateObject.month - 1, dateObject.day)
        return date.toLocaleDateString();
    }

    getUserName(userRole: string): string {
        let userName;
        switch (userRole) {
            case 'superadmin':
                userName = this.userId();
                break;
            case 'instituteadmin':
                userName = this.registeredDetails()[0] && this.registeredDetails()[0].adminName ?
                    this.registeredDetails()[0].adminName : this.userId();
                break;
            case 'schooladmin':
                userName = this.registeredDetails()[0] && this.registeredDetails()[0].adminName ?
                    this.registeredDetails()[0].adminName : this.userId();
                break;
            case 'teachingstaff':
                userName = this.registeredDetails()[0] && this.registeredDetails()[0].staffName ?
                    this.registeredDetails()[0].staffName : this.userId();
                break;
            case 'nonteachingstaff':
                userName = this.registeredDetails()[0] && this.registeredDetails()[0].staffName ?
                    this.registeredDetails()[0].staffName : this.userId();
                break;
            case 'parent':
                userName = this.registeredDetails()[0] && this.registeredDetails()[0].parentName ?
                    this.registeredDetails()[0].parentName : this.userId();
                break;
            default:
                userName = this.userId();
                break;
        }
        return userName;
    }

    getCollection(userRole: string): string {
        let collection;
        switch (userRole) {
            case 'superadmin':
                collection = this.userId();
                break;
            case 'instituteadmin':
                collection = 'institutes';
                break;
            case 'schooladmin':
                collection = 'schools';
                break;
            case 'teachingstaff':
                collection = 'staffs';
                break;
            case 'nonteachingstaff':
                collection = 'staffs';
                break;
            case 'parent':
                collection = 'parents';
                break;
            default:
                collection = this.userId();
                break;
        }
        return collection;
    }

    getUserPicture(userRole: string): string {
        let userPicture;
        switch (userRole) {
            case 'superadmin':
                userPicture = 'assets/images/logo.png';
                break;
            case 'instituteadmin':
                userPicture = this.registeredDetails()[0] && this.registeredDetails()[0].instituteLogo ?
                    this.registeredDetails()[0].instituteLogo : 'assets/images/userlogo.png';
                break;
            case 'schooladmin':
                userPicture = this.registeredDetails()[0] && this.registeredDetails()[0].schoolLogo ?
                    this.registeredDetails()[0].schoolLogo : 'assets/images/userlogo.png';
                break;
            case 'teachingstaff':
                userPicture = this.registeredDetails()[0] && this.registeredDetails()[0].photo ?
                    this.registeredDetails()[0].photo : 'assets/images/userlogo.png';
                break;
            case 'nonteachingstaff':
                userPicture = this.registeredDetails()[0] && this.registeredDetails()[0].photo ?
                    this.registeredDetails()[0].photo : 'assets/images/userlogo.png';
                break;
            case 'parent':
                userPicture = this.getSelectedChildren() && this.getSelectedChildren().photo ?
                    this.getSelectedChildren().photo : 'assets/images/userlogo.png';
                break;
            default:
                userPicture = 'assets/images/userlogo.png';
                break;
        }
        return userPicture;

    }

    getSName(userRole: string): string {
        let name;
        switch (userRole) {
            case 'superadmin':
                name = 'DiGiRekord';
                break;
            case 'instituteadmin':
                name = this.registeredDetails()[0] && this.registeredDetails()[0].instituteName ?
                    this.registeredDetails()[0].instituteName : this.userId();
                break;
            case 'schooladmin':
                name = this.registeredDetails()[0] && this.registeredDetails()[0].schoolName ?
                    this.registeredDetails()[0].schoolName : this.userId();
                break;
            case 'teachingstaff':
                name = this.registeredDetails()[0] && this.registeredDetails()[0].schoolName ?
                    this.registeredDetails()[0].schoolName : this.userId();
                break;
            case 'nonteachingstaff':
                name = this.registeredDetails()[0] && this.registeredDetails()[0].schoolName ?
                    this.registeredDetails()[0].schoolName : this.userId();
                break;
            case 'parent':
                name = this.getSelectedChildren() && this.getSelectedChildren().schoolName ?
                    this.getSelectedChildren().schoolName : this.userId();
                break;
            default:
                name = this.userId()
                break;
        }
        return name;
    }

    getLogo(userRole: string): string {
        let logo;
        switch (userRole) {
            case 'superadmin':
                logo = 'assets/images/logo.png';
                break;
            case 'instituteadmin':
                logo = this.registeredDetails()[0] && this.registeredDetails()[0].instituteLogo ?
                    this.registeredDetails()[0].instituteLogo : 'assets/images/logo.jpg';
                break;
            case 'schooladmin':
                logo = this.registeredDetails()[0] && this.registeredDetails()[0].schoolLogo ?
                    this.registeredDetails()[0].schoolLogo : 'assets/images/logo.jpg';
                break;
            case 'teachingstaff':
                logo = this.registeredDetails()[0] && this.registeredDetails()[0].schoolLogo ?
                    this.registeredDetails()[0].schoolLogo : 'assets/images/logo.jpg';
                break;
            case 'nonteachingstaff':
                logo = this.registeredDetails()[0] && this.registeredDetails()[0].schoolLogo ?
                    this.registeredDetails()[0].schoolLogo : 'assets/images/logo.jpg';
                break;
            case 'parent':
                logo = this.getSelectedChildren() && this.getSelectedChildren().schoolLogo ?
                    this.getSelectedChildren().schoolLogo : 'assets/images/logo.jpg';
                break;
            default:
                logo = 'assets/images/logo.jpg';
                break;
        }
        return logo;
    }

    getParentsChild() {
        const childs = this.registeredDetails()[0] && this.registeredDetails()[0].studentIDs
            ? this.registeredDetails()[0].studentIDs : []
        return childs;
    }

    getSelectedChildren() {
        return JSON.parse(localStorage.getItem('selectedChildren'));
    }

    getAllClasses() {
        let classArray = [];
        classArray = JSON.parse(JSON.stringify(this.registeredDetails()[0].classTeacherDetails));
        const subjectDetail = this.registeredDetails()[0].subjects;
        subjectDetail.forEach(sub => {
            classArray = classArray.concat(sub.classDetails)
        });
        const destArray = _.uniq(classArray, function (x) {
            return x.classID;
        });
        return destArray;
    }

    getSchoolID() {
        if (this.userRole() === 'parent') {
            let sChild;
            if (this.getSelectedChildren()) {
                sChild = this.getSelectedChildren();
            } else {
                sChild = this.getParentsChild()[0]
            }
            return sChild.schoolID;
        } else {
            return this.registeredDetails()[0] ? this.registeredDetails()[0].schoolID : ''
        }
    }

    getInstituteID() {
        let id;
        switch (this.userRole().toLocaleLowerCase()) {
            case 'instituteadmin':
                id = this.registeredDetails()[0] && this.registeredDetails()[0].instituteID ?
                    this.registeredDetails()[0].instituteID : '';
                break;
        }
        return id;
    }

    destroyStoreData() {
        this._classDetail = undefined;
        this._subjectDetail = undefined;
        this._schoolDetail = undefined;
        this._termDetail = undefined;
    }
}
