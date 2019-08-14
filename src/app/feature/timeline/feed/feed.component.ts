import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoginUserService, TimelineMgmtService, SchoolMgmtService, Broadcaster } from '../../../helpers/services/service';
import { Router } from '@angular/router';
import { CONFIG } from '../../../app.constant';
import { Util } from '../../../helpers/util'
import * as _ from 'underscore';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-timeline-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {
  _router: Router;
  listFilter = '';
  modalReference: any;
  closeResult: string;
  url: string;
  model: any = {
  };
  loading = false;
  message: string;
  posts: any[]=[];
  childrenUpdateEvent: any;
  selectedPost: any;
  
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private auth: LoginUserService,
    private broadcaster: Broadcaster,
    private timelineService: TimelineMgmtService,
    public util: Util
  ) { }

  ngOnInit() {
    //this.timeZone=this.auth.timeZone();
    this.getAllMessages();
    this.childrenUpdateEvent = this.broadcaster.on<string>('onChangeSelectedChild')
      .subscribe(message => {
        console.log("event fire")
        this.getAllMessages();
      });
  }

  getLocalDate(date){
    //console.log(date);
    return this.auth.getLocalDate(date)
  }

  getAllMessages() {
    let userId = '';
    if (this.auth.userRole() === 'parent') {
      const sChild = this.auth.getSelectedChildren();
      userId = sChild && sChild.studentRollNo ? sChild.studentRollNo : '';
    }
    else {
      userId = this.auth.userId();
    }
    //update user ID with correct implementation
    this.timelineService.getAllMessages(userId)
      .subscribe(
      messages => {
        if (messages) {
          this.posts = messages.sort(function (a, b) {
            return (a.createdDate < b.createdDate) ? 1 : ((b.createdDate < a.createdDate) ? -1 : 0);
          });
        } else {
        }
      },
      error => {
      });
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
      onClosed: function () {
        $('.modais').iziModal('destroy');
      }
    })
  }

  playVideo(at, type) {
    if (type === 'image')
      this.inizilizeModal(at, true)
    else
      this.inizilizeModal(at, false)
  }

  ngOnDestroy() {
    this.childrenUpdateEvent.unsubscribe();
  }

  openModelWithDetail(model, data) {
    this.selectedPost = data;
    this.modalService.open(model, { size: 'lg' });
  }
}



