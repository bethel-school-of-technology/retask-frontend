import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { User, Task, Reward } from '@app/_models';
import { UserService, AuthenticationService, ReTaskService, RewardService } from '@app/_services';
import { TaskService } from '@app/_services/task.service';
import { isToday } from 'date-fns';

@Component({ templateUrl: 'home.component.html', styleUrls: ['home.component.css'] })
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    taskList: Task[];
    rewardList: Reward[];
    currentDateTime: Date;

    // loading page variable
    pageLoading = true;
    cnt = 0;
    totRewards = 0; // total number of rewards

    constructor(
        private authenticationService: AuthenticationService,
        private taskService: TaskService,
        private rewardService: RewardService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        // this.loadAllUsers();
        this.taskService.getAllbyUsername(this.currentUser).then(tasksIn => {
          this.taskList = tasksIn as Task[];
          this.currentDateTime = new Date();
          console.log(this.taskList[0].enddate);
          this.currentDateTime = this.taskList[0].enddate;
          // tslint:disable-next-line:radix
          //    this.currentDataTime = this.currentDateTime + 500;
          console.log(this.currentDateTime);
          if (
            this.currentDateTime < this.taskList[0].enddate
          ) {
            console.log('im here!');
          }
          console.log(this.taskList);
        });

        this.rewardService.getAllbyUsername(this.currentUser).then(rewardsIn => {
          this.rewardList = rewardsIn as Reward[];
          this.totRewards = this.rewardList.length;
          console.log(this.rewardList);
          this.pageLoading = false;
        });
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    next() {
      if (
        this.totRewards > this.cnt + 1
      ) {
      this.cnt = this.cnt + 1;
      }
    }

    previous() {
      if (
        this.cnt - 1 >= 0
      ) {this.cnt = this.cnt - 1; }
    }

}
