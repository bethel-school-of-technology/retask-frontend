import { Component, OnInit } from '@angular/core';

import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';
import { ReTaskService, RewardService, UserService, AuthenticationService } from '@app/_services';
import { Reward, Upload, User } from '@app/_models';


@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  user: SocialUser;
  currentUser: User;

  rewardToAdd: Reward = {
    "id": null,
    "name": null,
    "descr": null,
    "username": "",
    "cost": null,
    "uploads": []
  }

  constructor(private authService: AuthService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private rewardService: RewardService) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
    });
    this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    console.log(this.user)
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signInWithLinkedIn(): void {
    this.authService.signIn(LinkedInLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }


  createReward() {
    alert("this is in createReward")
    this.rewardToAdd.username = this.currentUser.username;
    this.rewardToAdd.uploads = [];
    let tempUpload = new Upload;
    tempUpload.type = "jpg";
    this.rewardToAdd.uploads.push(tempUpload);
    

    let rewardsToAdd: Reward[] = [];
    rewardsToAdd.push(this.rewardToAdd);
    this.rewardService.createWithFile(rewardsToAdd, this.currentUser, this.selectedFile)
      .then(res => {
        console.log(res)
      });
  }

  selectedFile;

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    // was in seperate events
    console.log(this.selectedFile);

  }

}
