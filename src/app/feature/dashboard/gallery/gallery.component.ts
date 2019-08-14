import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { LoginUserService, GalleryMgmtService, AchievementMgmtService } from '../../../helpers/services/service';
import { CONFIG } from '../../../app.constant';
import { Util } from '../../../helpers/util';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as _ from 'underscore';
import { Router } from '@angular/router';
/**
 *
 */
@Component({
    selector: 'app-dashboard-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class DashboardGalleryComponent implements OnInit {
    url: string;
    model: any = {
    };
    loading = false;
    message: string;
    achievements: any = [];
    images: any = [];
    rowBatchSize = 3;
    constructor(
        private auth: LoginUserService,
        private galleryMgmtService: GalleryMgmtService,
        private achievementService: AchievementMgmtService,
        public util: Util,
        public toastr: ToastsManager,
        vcr: ViewContainerRef,
        private router: Router
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.getGalleryImages();
        this.getAchievements();
    }

    galleryPage= function () {
      this.router.navigateByUrl('/private/gallery');
    };
    newsPage= function () {
      this.router.navigateByUrl('/private/achievements');
    };
    
    getGalleryImages() {
        const schoolId = this.auth.getSchoolID();
        this.galleryMgmtService.getGalleryImages({ schoolID: schoolId })
            .subscribe(
            gallery => {
                if (gallery || !gallery.error) {
                    this.images = gallery
                } else {
                }
            },
            error => {
            });
    }

    getAchievements() {
        const schoolId = this.auth.getSchoolID();
        this.achievementService.getAchievements({ schoolID: schoolId })
            .subscribe(
            achievement => {
                if (achievement || !achievement.error) {
                    this.achievements = achievement;
                } else {
                }
            },
            error => {
            });
    }

    getImage(data) {
        const attachment = data.attachments.find(item => {
            return item.mimeType === 'image';
        });
        if (attachment) {
            return attachment.fileUrl
        } else {
            return '/assets/images/default_logo.png'
        }
    }
}