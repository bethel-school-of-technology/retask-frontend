import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Task, Reward, User } from '@app/_models';
import { RewardService, AuthenticationService } from '@app/_services';
import { Subscription } from 'rxjs';

export interface DialogData {
  animal: string;
  name: string;
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  animal: string;
  name: string;
  currentUser: User;
  currentUserSubscription: Subscription;


  reward: Reward = new Reward();
  rewards: Reward[] = [];
  indx: number = 0;

  constructor(public dialog: MatDialog, public rewardService: RewardService,
    private authenticationService: AuthenticationService) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.rewardService.getAllbyUsername(this.currentUser)
      .then(res => {
        this.rewards = res as Reward[];
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.animal = result;
    });
  }

  saveRewardChanges(rewardIn: Reward) {

    //console.log(rewardIn);
    if (this.picChanged) {
      this.rewardService.updatePic(rewardIn, this.currentUser, this.selectedFile)
        .then(res => {
          this.picChanged = false;
          console.log(res);
        });
    } else {
      this.rewardService.update(rewardIn, this.currentUser)
        .then(res => {
          console.log(res);
        });
    }
  }

  selectedFile;
  picChanged: boolean = false;

  onFileSelected(event) {
    this.picChanged = true;
    this.selectedFile = event.target.files[0];
    // was in seperate events
    console.log(this.selectedFile);

  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

