import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { User, Task, Reward } from '@app/_models';
import {
  UserService,
  AuthenticationService,
  ReTaskService,
  RewardService
} from '@app/_services';
import { TaskService } from '@app/_services/task.service';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: User;
  currentUserSubscription: Subscription;
  taskList: Task[];
  rewardList: Reward[];
  // tslint:disable-next-line:ban-types
  rewardPercentage: Number;
  currentDateTime: Date = new Date();

  // loading page variable
  pageLoading = true;
  cnt = 0;
  totRewards = 0; // total number of rewards
  displayDate: any;
  completedTaskList: any;

  progressIn: number[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private taskService: TaskService,
    private rewardService: RewardService,
    private datePipe: DatePipe
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      }
    );
  }

  ngOnInit() {

    this.getTasks();

    this.rewardService.getAllbyUsername(this.currentUser).then(rewardsIn => {
      this.rewardList = rewardsIn as Reward[];
      this.totRewards = this.rewardList.length;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.rewardList.length; i++) {
        this.progressIn[i] =
          (this.currentUser.points / this.rewardList[i].cost) * 100;
        if (this.progressIn[i] > 100) {
          this.progressIn[i] = 100;
        } else {
          this.progressIn[i] = Math.trunc(this.progressIn[i]);
        }
        console.log(
          this.currentUser.points,
          this.rewardList[i].cost,
          this.rewardList[i].name,
          this.progressIn[i]
        );
      }
      this.pageLoading = false;
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  next() {
    if (this.totRewards > this.cnt + 1) {
      this.cnt = this.cnt + 1;
    }
  }

  previous() {
    if (this.cnt - 1 >= 0) {
      this.cnt = this.cnt - 1;
    }
  }

  getTasks() {
    console.log(this.currentDateTime);
    this.displayDate = this.datePipe.transform(
      this.currentDateTime,
      'EE MM-dd-yy'
    );
    this.taskService
      .getOpenTasks(
        this.currentUser,
        this.currentDateTime,
        this.currentDateTime
      )
      .then(tasksIn => {
        this.taskList = tasksIn as Task[];
      });
  }

  makeComplete(itemComplete, indx) {
    console.log(itemComplete, indx);

    if (itemComplete) {
      this.taskService
        .completeTask(
          this.currentUser,
          this.taskList[indx].id,
          this.currentDateTime
        )
        .then(res => {
          console.log(res);
          // this.completedTaskList.push(this.taskList[indx]);
          this.taskList.splice(indx, 1);
        });
    }
  }
}
