import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, } from 'rxjs';

import { environment } from '@environments/environment'

import { Reward, User } from '@app/_models';
import { ReTaskService } from '@app/_services/retask.service';


@Injectable({
  providedIn: 'root'
})
export class RewardService {

  constructor(public reTaskService: ReTaskService) { }

  getAllbyUsername(user: User) {
    return new Promise(resolve => {
      this.reTaskService.getRewardsByUsername(user.accessToken)
        .subscribe(rewards => {
          //console.log(rewards)
          resolve(rewards);
        }, err => {
          console.log(err.message);
        });
    });
  }

  getById(id: number) {
    //return this.http.get(`${environment.apiUrl}/users/${id}`);
  }

  // only used for one reward at a time.
  createWithFile(rewards: Reward[], user: User, pic: File) {
    return new Promise(resolve => {
      this.reTaskService.setAWSPic(pic, user.accessToken)
        .subscribe(res => {
          // set the rewards upload url to the aws url 
          rewards[0].uploads[0].url = res.url;
          this.reTaskService.createReward(rewards, user.accessToken)
            .subscribe(rewards => {
              //console.log(rewards)
              resolve(rewards);
            }, err => {
              console.log(err.message);
            });
        });
    });
    //return this.http.put(`${environment.apiUrl}/users/${task.id}`, task);
  }

  create(rewards: Reward[], user: User) {
    return new Promise(resolve => {
      this.reTaskService.createReward(rewards, user.accessToken)
        .subscribe(rewards => {
          //console.log(rewards)
          resolve(rewards);
        }, err => {
          console.log(err.message);
        });
    });
    //return this.http.put(`${environment.apiUrl}/users/${task.id}`, task);
  }

  // update the reward
  update(reward: Reward, user: User) {
    //console.log("delete reward", reward)
    let rewards: Reward[] = [];
    rewards.push(reward);

    return new Promise(resolve => {
      this.reTaskService.updateReward(rewards, user.accessToken)
        .subscribe(res => {
          //console.log(res)
          resolve(res);
        }, err => {
          console.log(err.message);
        });
    });
  }

  // update the reward picture
  updatePic(reward: Reward, user: User, pic: File) {
    //console.log("delete reward", reward)
    let rewards: Reward[] = [];
    rewards.push(reward);

    return new Promise(resolve => {
      this.reTaskService.setAWSPic(pic, user.accessToken)
        .subscribe(res => {
          // set the rewards upload url to the aws url 
          rewards[0].uploads[0].url = res.url;
          this.reTaskService.updateReward(rewards, user.accessToken)
            .subscribe(res => {
              //console.log(res)
              resolve(res);
            }, err => {
              console.log(err.message);
            });
        });
    });
  }

  // delete the reward
  delete(reward: Reward, user: User) {
    //console.log("delete reward", reward)
    return new Promise(resolve => {
      this.reTaskService.deleteReward(reward, user.accessToken)
        .subscribe(res => {
          //console.log(res)
          resolve(res);
        }, err => {
          console.log(err.message);
        });
    });
  }
}
