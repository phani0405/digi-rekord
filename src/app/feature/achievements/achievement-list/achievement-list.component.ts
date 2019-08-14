import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoginUserService, AchievementMgmtService } from '../../../helpers/services/service';
import { Router } from '@angular/router';
import { CONFIG } from '../../../app.constant';
import { Util } from '../../../helpers/util';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as _ from 'underscore';
declare var jquery: any;
declare var $: any;
/**
 *
 */
@Component({
    selector: 'app-achievement-list',
    templateUrl: './achievement-list.component.html',
    styleUrls: ['./achievement-list.component.scss'],
})
export class AchievementListComponent implements OnInit {
    _router: Router;
    url: string;
    model: any = {
    };
    modalReference: any;
    closeResult: string;
    loading = false;
    message: string;
    posts: any[];
    childrenUpdateEvent: any;
    achievements: any = [];
    rowBatchSize = 3;
    deleteModelReference: any;
    userId: string;
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private auth: LoginUserService,
        private achievementService: AchievementMgmtService,
        public util: Util,
        public toastr: ToastsManager,
        vcr: ViewContainerRef,
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.getAchievements();
        this.userId=this.auth.userId();
    }

    checkAccessToAddItem() {
        const userRole = this.auth.userRole();
        if (userRole.toLocaleLowerCase() === 'schooladmin') {
            return true;
        } else {
            return false;
        }
    }

    getSchoolID() {
        if (this.auth.userRole() === 'parent') {
            const sChild = this.auth.getSelectedChildren();
            return sChild.schoolID;
        } else {
            return this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].schoolID : ''
        }
    }

    getAchievements() {
        const schoolId = this.getSchoolID();
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
        if(attachment) {
            return attachment.fileUrl
        } else {
            return '/assets/images/default_logo.png'
        }
    }

    getUserDetail() {
        return {
            'userId': this.auth.userId(),
            'userName': this.auth.getUserName(this.auth.userRole()),
            'photoUrl': this.auth.getUserPicture(this.auth.userRole()),
            'createdDate': new Date()
        };
    }

    getRequestObject(achievementId, commentID?: any) {
        return {
            acheivementID: achievementId,
            schoolID: this.getSchoolID(),
            instituteID: this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '',
            updatedBy: this.auth.userId(),
            commentID: commentID,
        }
    }

    initializeModal(at, img?: any) {
        $('.achievement-model').iziModal({
            title: at.fileName,
            iframe: true,
            iframeURL: at.fileUrl,
            navigateArrows: true,
            fullscreen: true,
            openFullscreen: false,
            closeOnEscape: false,
            overlayClose: false,
            overlay: false,
            history: false,
            overlayColor: '',
            top: 100,
            iframeHeight: img.height > 500 ? 500 : img.height,
            width: img.width > 700 ? 700 : img.width,
            closeButton: true,
            zindex: 1100,
            onClosed: function () {
                $('.achievement-model').iziModal('destroy');
            },
        });
    }

    openPreviewModel(content, selectedAchievement) {
        this.model.selectedAchievement = selectedAchievement;
        this.modalReference = this.modalService.open(content, { size: 'lg' });
        this.modalReference.result.then((result) => {
            this.resetModelAndMessage();
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    openCommentModel(content, selectedAchievement) {
        this.model.selectedAchievementComments = selectedAchievement;
        this.modalReference = this.modalService.open(content, { size: 'lg' });
        this.modalReference.result.then((result) => {
            this.resetModelAndMessage();
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdp';
        } else {
            this.resetModelAndMessage();
            return `with: ${reason}`;
        }
    }

    resetModelAndMessage() {
        this.model = {};
        this.message = '';
    }

    increaseLike(achievement) {
        if (this.isDisableLikeButton(achievement)) {
            this.toastr.warning('You already like');
        } else {
            const req:any = this.getRequestObject(achievement.acheivementID);
            req.likes = this.getUserDetail();
            this.achievementService.addLike(req)
                .subscribe(
                res => {
                    if (res || !res.error) {
                        achievement.likes.push(this.getUserDetail());
                    } else {
                        this.toastr.error('Unable to like, please try later');
                    }
                },
                error => {
                });
        }
    }

    isDisableLikeButton(i) {
        const userId = this.auth.userId();
        if (i.likes && i.likes.length > 0) {
            return i.likes.some(function (el) {
                return el.userId === userId;
            });
        } else {
            return false;
        }
    }

    addComment() {
        const achievement = this.model.selectedAchievementComments;
        const newComment: any = this.getUserDetail();
        newComment.message = this.model.comment;
        const req: any = this.getRequestObject(achievement.acheivementID);
        req.comments = newComment;
        this.achievementService.addComment(req)
            .subscribe(
            res => {
                if (res || !res.error) {
                    req.commentID = res.commentID;
                    Object.assign(newComment, req)
                    achievement.comments.push(newComment);
                    this.model.comment = '';
                    this.toastr.success('Comment Added successfully');
                } else {
                    this.toastr.error('Unable to comment, please try later');
                }
            },
            error => {
            });
    }

    convertDataInXTimeAgo(date) {
        const current = Date.now();
        const previous = new Date(date);
        const msPerMinute = 60 * 1000;
        const msPerHour = msPerMinute * 60;
        const msPerDay = msPerHour * 24;
        const msPerMonth = msPerDay * 30;
        const msPerYear = msPerDay * 365;
        const elapsed = current - previous.getTime();
        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' seconds ago';
        } else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' minutes ago';
        } else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ' hours ago';
        } else if (elapsed < msPerMonth) {
            return Math.round(elapsed / msPerDay) + ' days ago';
        } else if (elapsed < msPerYear) {
            return Math.round(elapsed / msPerMonth) + ' months ago';
        } else {
            return Math.round(elapsed / msPerYear) + ' years ago';
        }
    }

    openDeleteModel(content, data) {
        this.model.selectedAchievementToDelete = data;
        this.deleteModelReference = this.modalService.open(content, { size: 'lg' });
    }

    deleteAchievement(achievement) {
        const data = {
            acheivementID: achievement.acheivementID,
            schoolID: achievement.schoolID
        };
        this.achievementService.deleteAchievement(data)
            .subscribe(
            response => {
                if (!response.error) {
                    this.toastr.success('Achievement deleted successfully');
                    // refresh the list
                    this.getAchievements();
                    this.deleteModelReference.dismiss('Manually');
                } else {
                    this.toastr.error(response.error);
                }

            },
            error => {
                this.toastr.error('Unable to delete, Please try again later...');
            },
        );
    }

    deleteComment(comment) {
        const data = this.getRequestObject(this.model.selectedAchievementComments.acheivementID, comment.commentID);
        delete data['instituteID'];
        this.achievementService.deleteComment(data)
            .subscribe(
            response => {
                if (!response.error) {
                    this.toastr.success('Comment deleted successfully');
                    // refresh the list
                    this.model.selectedAchievementComments.comments = this.model.selectedAchievementComments.comments.filter(item => {
                        return item.commentID !== comment.commentID
                    })
                } else {
                    this.toastr.error(response.error);
                }

            },
            error => {
                this.toastr.error('Unable to delete, Please try again later...');
            },
        );
    }

    inizilizeModal(at, openFullscreen) {
        $('.modais').iziModal({
            title: at.fileName,
            iframe: true,
            iframeURL: at.fileUrl,
            navigateArrows: true,
            fullscreen: true,
            openFullscreen: openFullscreen,
            closeOnEscape: false,
            overlayClose: false,
            overlay: false,
            history: false,
            overlayColor: '',
            iframeHeight: 500,
            width: 800,
            closeButton: true,
            zindex: 1100,
            onClosed: function() {
              $('.modais').iziModal('destroy');
            }
          })
      }
  
      playVideo(at, type) {
        if(type === 'image')
          this.inizilizeModal(at, false)
        else 
          this.inizilizeModal(at, false)
      }

}



