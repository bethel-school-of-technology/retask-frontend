import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserUpdateForm } from '@app/_models/user';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthenticationService, UserService, AlertService, RewardService } from '@app/_services';
import { ApiResponse } from '@app/_models/apiResponse';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-rewards2',
  templateUrl: './rewards2.component.html',
  styleUrls: ['./rewards2.component.css']
})
export class Rewards2Component implements OnInit, OnDestroy {

  currentUser: User;
  currentUserSubscription: Subscription;

  rewardsIn: any[];
  progressIn: number[] = [0, 0, 0];
  cantBuy: boolean[] = [true, true, true];

  pageLoading: boolean = true;

  rewards_perpage: number = 3;
  pageCnt: number = 2;
  page: number = 0;
  totPageCnt: number = 1;
  cnt: number = 0;

  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private rewardService: RewardService,
    private sanitizer: DomSanitizer,
    private alertService: AlertService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  todo = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  done = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }



  ngOnInit() {

    // load the rewards that a user has setup
    this.rewardService.getAllbyUsername(this.currentUser)
      .then(rewardsIn => {
        this.rewardsIn = rewardsIn as any[];
        this.page = 0; //set to first page 
        this.totPageCnt = Math.ceil(this.rewardsIn.length / this.rewards_perpage);
        this.pageCnt = this.rewardsIn.length - (this.page * this.rewards_perpage);
        this.cnt = 0;
        // if greate than rewards_perpage set to rewards_perpage
        if (this.pageCnt > this.rewards_perpage)
          this.pageCnt = this.rewards_perpage;
        console.log("total page cnt = " + this.totPageCnt);
        console.log(this.pageCnt);

        this.setProgress();

        this.pageLoading = false;
      });

  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  goFoward() {
    if (this.totPageCnt > this.page) {
      this.page = this.page + 1
      this.cnt = this.cnt + 3;
      this.pageCnt = this.rewardsIn.length - (this.page * this.rewards_perpage);
      // if greate than rewards_perpage set to rewards_perpage
      if (this.pageCnt > this.rewards_perpage)
        this.pageCnt = this.rewards_perpage;

        console.log("from goForward")
      this.setProgress();
    }
    console.log("total page cnt = " + this.totPageCnt);
    console.log(this.pageCnt);
  }

  goBackward() {
    if (this.page > 0) {
      this.page = this.page - 1;
      this.cnt = this.cnt - 3;
      this.pageCnt = this.rewards_perpage;
      // if greate than rewards_perpage set to rewards_perpage
      if (this.pageCnt > this.rewards_perpage)
        this.pageCnt = this.rewards_perpage;

      console.log("from goBackward")
      this.setProgress();
    }
    console.log("total page cnt = " + this.totPageCnt);
    console.log(this.pageCnt);
  }

  addReward: boolean = false;

  addRewards() {
    this.addReward = !this.addReward;
  }

  setProgress() {
    console.log(this.pageCnt);
    console.log(this.cnt);
    for (var i = 0; i < this.pageCnt; i++) {
      if (this.rewardsIn[this.cnt + i].cost < this.currentUser.points) {
        this.progressIn[i] = 100;
        this.cantBuy[i] = false;
        console.log("In greateer than")
      } else {
        this.progressIn[i] = this.currentUser.points / this.rewardsIn[this.cnt + i].cost * 100;
        this.cantBuy[i] = true;
      }
    }

  }



}
