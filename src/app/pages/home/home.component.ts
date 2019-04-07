import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { User, Task, Reward } from '@app/_models';
import { UserService, AuthenticationService, ReTaskService } from '@app/_services';

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
        private userService: UserService,
        private reTaskService: ReTaskService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        // this.loadAllUsers();
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

}
