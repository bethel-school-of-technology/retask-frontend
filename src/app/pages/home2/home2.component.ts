import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { User, Task, Reward } from '@app/_models';
import { UserService, AuthenticationService, ReTaskService, RewardService } from '@app/_services';
import { TaskService } from '@app/_services/task.service';

@Component({ templateUrl: 'home2.component.html', styleUrls: ['home2.component.css'] })
export class Home2Component implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    taskList: Task[];
    rewardList: Reward[];

    cnt: number = 0;
    totRewards: number = 0; // total number of rewards

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
          this.taskList=<Task[]>tasksIn;
          console.log(this.taskList);
        });

        this.rewardService.getAllbyUsername(this.currentUser).then(rewardsIn => {
          this.rewardList=<Reward[]>rewardsIn;
          this.totRewards=this.rewardList.length;
          console.log(this.rewardList);
        });
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    next() {
      this.cnt=this.cnt+1;
    }

    previous() {
      this.cnt=this.cnt-1;
    }

}

