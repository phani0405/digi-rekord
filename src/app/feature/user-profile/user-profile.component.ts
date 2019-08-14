import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { ProfileService, AlertService, LoginUserService, UploadService } from '../../helpers/services/service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CONFIG } from '../../app.constant';
import { Upload } from '../../helpers/models/upload-file.models';
import * as _ from 'underscore';
import { Util } from '../../helpers/util'; 

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  model: any ={
    url: undefined
  };
  userDetails: any = {};
  uploadingImageLoading: any;
  currentUpload: Upload;
  constructor(
    private auth : LoginUserService,
    private profileService : ProfileService,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    private upSvc: UploadService,
    public util: Util,
  ) { 
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.getUserDetails();
    this.getUserProfile();
  }

  getUserDetails(){
    this.userDetails.userID= this.auth.userId();
    this.userDetails.userRole= this.auth.userRole();
    this.userDetails.collection= this.auth.getCollection(this.userDetails.userRole.toLowerCase());
  }

  getUserProfile() {
    this.profileService.getProfile(this.userDetails)
    .subscribe(
        profileDetail => {
            if (profileDetail) {
                this.updateProfileDetails(profileDetail);
            } else {
            }
        },
    );
  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        const file = event.target.files;
        if(CONFIG.LOGO_FILE_TYPE.indexOf(file[0].type) === -1) {
            this.toastr.error(CONFIG.MSG.invalid_logo_file_type);
            return;
        }
        if(file[0].size >= CONFIG.LOGO_MAX_SIZE) {
            this.toastr.error(CONFIG.MSG.invalid_logo_file_size);
            return;
        }
        if (file && file.length === 1) {
            this.currentUpload = new Upload(file.item(0));
            this.uploadingImageLoading = true; 
            this.upSvc.pushUpload(this.currentUpload).then(
                success => {
                    this.uploadingImageLoading = false; 
                    const upload: any = success;
                    this.model.url = upload.url;
                    reader.readAsDataURL(event.target.files[0]);
                    this.toastr.success('File uploaded successfully');
                },
                error => {
                    this.uploadingImageLoading = false; 
                    this.toastr.error('Unable to upload, Please try again later...');
                },
            );
        } else {
            this.uploadingImageLoading = false; 
            this.toastr.error('Unable to upload, Please try again later...');
        }
    }
  }

  updatePassword(){
    var passwordDetails: any= {};
    passwordDetails.userID= this.auth.userId();
    passwordDetails.password= this.model.userPassword;
    passwordDetails.newPassword= this.model.userNewPassword;
    passwordDetails.confirmPassword= this.model.userConPassword;
    this.profileService.updatePassword(passwordDetails).
      subscribe(
        response =>{
          if(!response.error){
            this.toastr.success('Password updated successfully');
            this.getUserProfile();
          }else{
            this.toastr.error(response.error +', Please try again');
          }
       },
       error => {
        this.toastr.error('Unable to update password, Please try again later...');
       }

      );
  }

  updateProfileDetails(profileDetail){
    switch (this.userDetails.userRole.toLowerCase()) {
      case 'superadmin':
          
        break;
      case 'instituteadmin':
        this.model.userName = profileDetail.adminName;
        this.model.userEmail = profileDetail.adminEmailID;
        this.model.userMobile = profileDetail.adminMobile;
        this.model.userAddress = profileDetail.adminAddress.address;
        this.model.url = profileDetail.adminPhoto;
        break;
      case 'schooladmin':
        this.model.userName = profileDetail.adminName;
        this.model.userEmail = profileDetail.adminEmailID;
        this.model.userMobile = profileDetail.adminMobile;
        this.model.userAddress = profileDetail.adminAddress.address;
        this.model.url = profileDetail.adminPhoto;
        break;
      case 'teachingstaff':
        this.model.userName = profileDetail.staffName;
        this.model.userEmail = profileDetail.staffEmailID;
        this.model.userMobile = profileDetail.staffMobile;
        this.model.userAddress = profileDetail.staffAddress.address;
        this.model.url = profileDetail.photo;
        break;
      case 'nonteachingstaff':
        this.model.userName = profileDetail.staffName;
        this.model.userEmail = profileDetail.staffEmailID;
        this.model.userMobile = profileDetail.staffMobile;
        this.model.userAddress = profileDetail.staffAddress.address;
        this.model.url = profileDetail.photo;
        break; 
      case 'parent':
        this.model.userName = profileDetail.parentName;
        this.model.userEmail = profileDetail.parentEmailID;
        this.model.userMobile = profileDetail.parentMobile;
        this.model.userAddress = this.getParentAddress(profileDetail);
        this.model.url = profileDetail.photo;
        break;  
        
      default:
          
      break;
    }
  
  }

  getParentAddress(profileDetail){
    var selectedChild= this.auth.getSelectedChildren();
    var child= _.find(profileDetail.studentIDs, function(std : any){ 
      return std.studentID === selectedChild.studentID;
    });
    return child.studentAddress.address ? child.studentAddress.address : '';
  }

  updateUserProfile(isPhoto){
    var profileDetail: any= {};
    switch (this.userDetails.userRole.toLowerCase()) {
      case 'superadmin':
          
        break;
      case 'instituteadmin':
        profileDetail.instituteID= this.auth.getInstituteID();
        profileDetail.updatedBy= this.userDetails.userID;
        profileDetail.updatedRole= this.auth.userRole();
        if(isPhoto){
          profileDetail.adminPhoto= this.model.url;
        }else{
          profileDetail.adminName = this.model.userName;
          profileDetail.adminEmailID= this.model.userEmail;
          profileDetail.adminMobile= this.model.userMobile;
          //profileDetail.adminAddress= this.model.userAddress;
          profileDetail.adminAddress= { "address": this.model.userAddress };
        }
        this.updateProfile(profileDetail, CONFIG.URL.UPDATE_INSTITUTE);
        break;
      case 'schooladmin':
        profileDetail.schoolID= this.auth.getSchoolID();
        profileDetail.updatedBy= this.userDetails.userID;
        profileDetail.updatedRole= this.auth.userRole();
        if(isPhoto){
          profileDetail.adminPhoto= this.model.url;
        }else{
          profileDetail.adminName = this.model.userName;
          profileDetail.adminEmailID= this.model.userEmail;
          profileDetail.adminMobile= this.model.userMobile;
          //profileDetail.adminAddress= this.model.userAddress;
          profileDetail.adminAddress= { "address": this.model.userAddress };
        }
        this.updateProfile(profileDetail, CONFIG.URL.UPDATE_SCHOOL);
        break;
      case 'teachingstaff':
        profileDetail.staffID= this.auth.registeredDetails()[0].staffID;
        profileDetail.schoolID= this.auth.getSchoolID();
        profileDetail.updatedBy= this.userDetails.userID;
        profileDetail.updatedRole= this.auth.userRole();
        if(isPhoto){
          profileDetail.photo= this.model.url;
        }else{
          profileDetail.staffName = this.model.userName;
          profileDetail.staffEmailID= this.model.userEmail;
          profileDetail.staffMobile= this.model.userMobile;
          profileDetail.staffAddress= { address: this.model.userAddress};
        }
        this.updateProfile(profileDetail, CONFIG.URL.UPDATE_STAFF);
        break;
      case 'nonteachingstaff':
        profileDetail.staffID= this.auth.registeredDetails()[0].staffID;
        profileDetail.schoolID= this.auth.getSchoolID();
        profileDetail.updatedBy= this.userDetails.userID;
        profileDetail.updatedRole= this.auth.userRole();
        if(isPhoto){
          profileDetail.photo= this.model.url;
        }else{
          profileDetail.staffName = this.model.userName;
          profileDetail.staffEmailID= this.model.userEmail;
          profileDetail.staffMobile= this.model.userMobile;
          profileDetail.staffAddress= { address: this.model.userAddress};
        }
        this.updateProfile(profileDetail, CONFIG.URL.UPDATE_STAFF);
        break; 
      case 'parent':
        profileDetail.studentID= this.auth.getSelectedChildren().studentID;
        profileDetail.updatedBy= this.userDetails.userID;
        profileDetail.parentID= this.auth.registeredDetails()[0].parentID;
        if(isPhoto){
          profileDetail.photo= this.model.url;
        }else{
          profileDetail.parentName = this.model.userName;
          profileDetail.parentEmailID= this.model.userEmail;
          profileDetail.parentMobile= this.model.userMobile;
          profileDetail.studentAddress= { address: this.model.userAddress};
        }
        this.updateProfile(profileDetail, CONFIG.URL.UPDATE_PARENT_PROFILE);
        break;  
        
      default:
        break;
    }

  
  }

  updateProfile(details, updateUrl){
    
    this.profileService.updateUserProfile(details,updateUrl).
      subscribe(
        response =>{
          if(!response.error){
            this.toastr.success('Profile updated successfully');
            this.getUserProfile();
          }else{
            this.toastr.error(response.error +', Please try again');
          }
       },
       error => {
        this.toastr.error('Unable to update profile, Please try again later...');
       }

      );
  }
}
