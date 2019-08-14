import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoginUserService, GalleryMgmtService } from '../../../helpers/services/service';
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
    selector: 'app-gallery-list',
    templateUrl: './gallery-list.component.html',
    styleUrls: ['./gallery-list.component.scss'],
})
export class GalleryListComponent implements OnInit {
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
    images: any = [];
    rowBatchSize = 3;
    deleteModelReference: any;
    userId: string;
    constructor(
        private router: Router,
        private modalService: NgbModal,
        private auth: LoginUserService,
        private galleryMgmtService: GalleryMgmtService,
        public util: Util,
        public toastr: ToastsManager,
        vcr: ViewContainerRef,
    ) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.getGalleryImages();
        this.userId=this.auth.userId();
    }

    checkAccessToAddImage() {
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

    getGalleryImages() {
        const schoolId = this.getSchoolID();
        this.galleryMgmtService.getGalleryImages({ schoolID: schoolId })
            .subscribe(
            gallery => {
                if (gallery || !gallery.error) {
                    this.parseImagesData(gallery);
                } else {
                }
            },
            error => {
            });
    }

    parseImagesData(data) {
        this.images = [];
        for (let i = 0; i < data.length;) {
            const obj = {
                image: [],
            };
            obj.image = data.slice(i, i + this.rowBatchSize);
            this.images.push(obj);
            i += 3;
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

    getRequestObject(imageId, commentID?: any) {
        return {
            imageID: imageId,
            schoolID: this.getSchoolID(),
            instituteID: this.auth.registeredDetails()[0] ? this.auth.registeredDetails()[0].instituteID : '',
            updatedBy: this.auth.userId(),
            commentID: commentID,
        }
    }

    initializeModal(at, img?: any) {
        $('.gallery-model').iziModal({
            title: at.imageName,
            iframe: true,
            iframeURL: at.imageUrl,
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
                $('.gallery-model').iziModal('destroy');
            },
        });
    }

    openPreview(at, type) {
        const self = this;
        if (type === 'image') {
            const img = new Image();
            img.onload = function () {
                self.initializeModal(at, img);
            };
            img.src = at.imageUrl;
        } else {
            this.initializeModal(at);
        }
    }

    openCommentModel(content, selectedImage) {
        this.model.selectedImageComments = selectedImage;
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

    increaseLike(image) {
        image.likes = image.likes;

        if (this.isDisableLikeButton(image)) {
            this.toastr.warning('You already like this image');
        } else {
            const req:any = this.getRequestObject(image.imageID);
            req.likes = this.getUserDetail();
            this.galleryMgmtService.addLike(req)
                .subscribe(
                res => {
                    if (res || !res.error) {
                        image.likes.push(this.getUserDetail());
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
        const image = this.model.selectedImageComments;
        const newComment: any = this.getUserDetail();
        newComment.message = this.model.comment;
        const req: any = this.getRequestObject(image.imageID);
        req.comments = newComment;
        this.galleryMgmtService.addComment(req)
            .subscribe(
            res => {
                if (res || !res.error) {
                    req.commentID = res.commentID;
                    Object.assign(newComment, req)
                    image.comments.push(newComment);
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
        this.model.selectedImageToDelete = data;
        this.model.modelType = 'Image';
        this.deleteModelReference = this.modalService.open(content, { size: 'lg' });
    }

    deleteImage(image) {
        const data = {
            imageID: image.imageID,
            schoolID: image.schoolID
        };
        this.galleryMgmtService.deleteImage(data)
            .subscribe(
            response => {
                if (!response.error) {
                    this.toastr.success('Image deleted successfully');
                    // refresh the list
                    this.getGalleryImages();
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
        const data = this.getRequestObject(this.model.selectedImageComments.imageID, comment.commentID);
        this.galleryMgmtService.deleteComment(data)
            .subscribe(
            response => {
                if (!response.error) {
                    this.toastr.success('Comment deleted successfully');
                    // refresh the list
                    this.model.selectedImageComments.comments = this.model.selectedImageComments.comments.filter(item => {
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
}



