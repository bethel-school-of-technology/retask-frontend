import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserUpdateForm, Reward, Upload } from '@app/_models';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthenticationService, UserService, AlertService, RewardService } from '@app/_services';
import { ApiResponse } from '@app/_models/apiResponse';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { inject } from '@angular/core/testing';





export interface TaskDialogData {
  animal: string;
  name: string;
}

export class Rewards2Component implements OnInit, OnDestroy {

  currentUser: User;
  currentUserSubscription: Subscription;

  rewardToAdd: Reward = {
    "id": null,
    "name": null,
    "descr": null,
    "username": "",
    "cost": null,
    "uploads": []
  }

  rewardsToAdd: Reward[] = [];

  rewardToDelete: Reward = {
    "id": null,
    "name": null,
    "descr": null,
    "username": "",
    "cost": null,
    "uploads": []
  }

  rewardsToDelete: Reward[] = [];




  rewardsIn: any[];
  progressIn: number[] = [0, 0, 0];
  cantBuy: boolean[] = [true, true, true];
  edit: boolean[] = [false, false, false];

  pageLoading: boolean = true;
  usingDragDrop: boolean = false;

  rewards_perpage: number = 3;
  pageCnt: number = 2;
  page: number = 0;
  totPageCnt: number = 1;
  // keeps track of the reward we are currently looking at
  cnt: number = 0;

  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private rewardService: RewardService,
    private sanitizer: DomSanitizer,
    private alertService: AlertService,
    public dialog: MatDialog,
  ) 
  {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  defautRewards: Reward[] = [
    {
      "id": null,
      "name": "Vacation",
      "descr": "Vacation Somewhere warm",
      "username": "",
      "cost": 750,
      "uploads": []
    }
  ];

  userRewards = [
    {
      "id": null,
      "name": "Vacation",
      "descr": "Vacation Somewhere warm",
      "username": "",
      "cost": 750,
      "uploads": []
    }
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
    this.loadRewards(false);
  }

  loadRewards(toEnd: boolean) {
    // load the rewards that a user has setup
    this.rewardService.getAllbyUsername(this.currentUser)
      .then(rewardsIn => {
        this.rewardsIn = rewardsIn as any[];

        this.totPageCnt = Math.ceil(this.rewardsIn.length / this.rewards_perpage);

        // if (toEnd)
        //   this.page = this.totPageCnt - 1;
        // else
        this.page = 0 //set to first page

        this.pageCnt = this.rewardsIn.length - (this.page * this.rewards_perpage);
        this.cnt = 0;
        // if greate than rewards_perpage set to rewards_perpage
        if (this.pageCnt > this.rewards_perpage)
          this.pageCnt = this.rewards_perpage;

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
    console.log("In Set Progress")
    console.log("Page Count", this.pageCnt);
    console.log("Total Count", this.cnt);
    for (var i = 0; i < this.pageCnt; i++) {
      if (this.rewardsIn[this.cnt + i].cost <= this.currentUser.points) {
        this.progressIn[i] = 100;
        this.cantBuy[i] = false;
        console.log("In greater than")
      } else {
        this.progressIn[i] = this.currentUser.points / this.rewardsIn[this.cnt + i].cost * 100;
        this.cantBuy[i] = true;
      }
      console.log(" in loop setProgress", this.cantBuy[i], this.rewardsIn[this.cnt + i].cost, this.rewardsIn[this.cnt + i].name)

    }

  }

  selectedFile;

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    // was in seperate events
    console.log(this.selectedFile);

  }


  //tried to copy what was happening on User Profile page

  changeImage: boolean = false;
  apiResults: ApiResponse;
  imageToShow: any;
  isImageLoading: boolean = true;


  onChangeFileSelected(event) {
    this.selectedFile = event.target.files[0];
    // was in seperate events
    this.userService.setPic(this.currentUser, this.selectedFile)
      .then(res => {
        console.log(res);
        this.apiResults = <ApiResponse>res;
        if (this.apiResults.status === 0) {

          this.alertService.success("Image Changed");
          this.getPic();
        } else {
          console.log("In here user-profile")
          this.alertService.error(this.apiResults.message);
        }
        this.changeImage = false;
      });

  }

  changeImageFunc() {
    this.changeImage = true;
  }

  getPic() {
    // Get the image 
    this.isImageLoading = true;

    this.userService.getPic(this.currentUser)
      .then(blobIn => {
        // creating the url to display the image from the Blob passed by the API
        this.imageToShow = URL.createObjectURL(blobIn);
        let urlCreator = window.URL;
        this.imageToShow = this.sanitizer.bypassSecurityTrustUrl(
          urlCreator.createObjectURL(blobIn));
        this.isImageLoading = false;
      });
  }

  //all of the above is from User Profile page


  createReward() {

    this.rewardToAdd.username = this.currentUser.username;
    this.rewardToAdd.uploads = [];
    let tempUpload = new Upload;
    tempUpload.url = "http://www.pbs.org/mercy-street/lunchbox_plugins/s/photogallery/img/no-image-available.jpg";
    tempUpload.type = "jpg";
    this.rewardToAdd.uploads.push(tempUpload);
    this.rewardsToAdd.push(this.rewardToAdd);

    let rewardsToAdd: Reward[] = [];
    rewardsToAdd.push(this.rewardToAdd);
    this.rewardService.createWithFile(rewardsToAdd, this.currentUser, this.selectedFile)
      .then(res => {
        console.log(res);
        this.loadRewards(false)
      });

    this.rewardsToAdd = []
    this.addReward = !this.addReward;


  }

  // this function redeems the reward
  redeem(rewardCost) {

    this.currentUser.points = this.currentUser.points - rewardCost;

    // 
    let tempUser = new UserUpdateForm;
    tempUser.firstName = this.currentUser.firstName;
    tempUser.lastName = this.currentUser.lastName;
    tempUser.phoneNbr = this.currentUser.phoneNbr;
    tempUser.points = this.currentUser.points;

    this.userService.update(tempUser, this.currentUser.accessToken)
      .then(res => {
        if (res.status == 0) {
          this.alertService.success("Points Updated");
          this.authenticationService.saveLocally(this.currentUser);
        }
        else {
          this.alertService.error("Save Failed");
          this.currentUser.points = this.currentUser.points + rewardCost;
        }
      });



  }

  deleteReward(rewardToDelete: Reward) {
    console.log("reward to delete", rewardToDelete)
    this.rewardService.delete(rewardToDelete, this.currentUser)
      .then(res => {
        console.log(res)
        this.loadRewards(true);

      });

  }

  editReward(indx) {
    this.edit[indx] = true;

  }

  cancelEdit(indx) {
    this.edit;
  }

  // updateReward(reward: Reward, user:User){
  //   this.rewardService.update(reward, this.currentUser)
  //   .then(res => {
  //     this.getReward();
  //   });
  // } else {
  // //delete the task
  // this.rewardService.delete(reward.id, this.currentUser)
  //   .then(res => {
  //     this.getTasks();
  //   });
  // }
  // this opens the dialog box
  openDialog(rewardIn: Reward, editIn: boolean): void {

    let reward: Reward = new Reward();

    reward.name = rewardIn.name
    reward.descr = rewardIn.descr;
    reward.cost = rewardIn.cost;
    reward.uploads = rewardIn.uploads;

    const dialogRef = this.dialog.open(DialogEditTaskDialog, {
      width: '255px',
      data: {
        reward: reward,
        edit: editIn

      }
    });

    // after the dialog box is closed this is run
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (editIn) {
          // edit the task
          rewardIn.name = reward.name
          rewardIn.descr = reward.descr;
          rewardIn.cost = reward.cost;
          rewardIn.uploads = reward.uploads;

        //   this.rewardService.update(rewardIn, this.currentUser)
        //     .then(res => {
        //       this.getRewards();
        //     });
        // } else {
        //   //delete the task
        //   this.rewardService.delete(rewardIn.id, this.currentUser)
        //     .then(res => {
        //       this.getRewards();
        //     });
        }
      }
    });
  }

}

@Component({
  selector: 'app-rewards2',
  templateUrl: './rewards2.component.html',
  styleUrls: ['./rewards2.component.css']
})


@Component({
  selector: 'dialog-edit-task-dialog',
  templateUrl: 'dialog-edit-task-dialog.html',
})
export class DialogEditTaskDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogEditTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { reward: Reward, edit: boolean }) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}