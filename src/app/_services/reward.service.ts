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
          console.log(rewards)
          resolve(rewards);
        }, err => {
          console.log(err.message);
        });
    });
  }

  getById(id: number) {
    //return this.http.get(`${environment.apiUrl}/users/${id}`);
  }

  create(reward: Reward) {
    //return this.http.put(`${environment.apiUrl}/users/${task.id}`, task);
  }

  update(reward: Reward) {
    //return this.http.put(`${environment.apiUrl}/users/${task.id}`, task);
  }

  delete(id: number) {
    //return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
}
