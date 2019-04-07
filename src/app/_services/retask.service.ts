import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, } from 'rxjs';

import { environment } from '@environments/environment'

import { User, UserUpdateForm, Reward, Task } from '@app/_models'

@Injectable({
  providedIn: 'root'
})
export class ReTaskService {

  constructor(public http: HttpClient,
              private sanitizer: DomSanitizer) { }

  // sanitize a link
  transform(html) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }

  // authenicateUser for now.  returns a user with a token
  authenticateUser(username, password): Observable<any> {
    let xurlParm = `${environment.reTaskUrl}/api/auth/signin`
    let dataIs = {
      "username": username,
      "password": password
    }
    return this.http.post(xurlParm, dataIs
      , {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }

  // create a new user.  Requires no security.
  registerUser(dataIs): Observable<any> {
    let urlParm = `${environment.reTaskUrl}/api/auth/signup`
    return this.http.post(urlParm, dataIs
      , {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }

  // get test.  This requires a token.
  test(token: string): Observable<any> {
    let urlParm = `${environment.reTaskUrl}/api/test/user`
    return this.http.get(urlParm
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/text'),
      }
    );
  }

  // get picture.  This requires a token.
  getPic(token: string): Observable<Blob> {
    let urlParm = `${environment.reTaskUrl}/user/downloadPic`
    return this.http.get(urlParm
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json'),
        responseType: 'blob'
      }
    );
  }

  // update the user.  This requires a token.
  setPic(pic: File, token: string): Observable<any> {
    const urlParm = `${environment.reTaskUrl}/user/uploadPic`

    const formData = new FormData();

    formData.append('file', pic, pic.name);

    return this.http.post(urlParm, formData
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
      }
    );
  }

  // update the user.  This requires a token.
  updateUser(user: UserUpdateForm, token: string): Observable<any> {
    const urlParm = `${environment.reTaskUrl}/user/updateUser`
    return this.http.post(urlParm, user
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json'),
        responseType: 'json'
      }
    );
  }

  // reset the password
  resetPassword(dataIs: any, token: string) {
    const urlParm = `${environment.reTaskUrl}/user/changePassword`
    return this.http.post(urlParm, dataIs
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json'),
        responseType: 'json'
      }
    );

  }


  // get all the rewards associated with a user
  getRewardsByUsername(token: string) {

    const urlParm = `${environment.reTaskUrl}/api/getrewardsbyusername`
    return this.http.get(urlParm
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json')
      }
    );
  }

  // update the user.  This requires a token.
  createReward(rewards: Reward[], token: string): Observable<any> {
    const urlParm = `${environment.reTaskUrl}/api/createrewards`;
    return this.http.post(urlParm, rewards
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json'),
        responseType: 'json'
      }
    );
  }

  // get all the rewards associated with a user
  getTasksByUsername(token: string) {

    const urlParm = `${environment.reTaskUrl}/api/gettasksbyusername`
    return this.http.get(urlParm
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json')
      }
    );
  }

  // update the user.  This requires a token.
  createTasks(tasks: Task[], token: string): Observable<any> {
    const urlParm = `${environment.reTaskUrl}/api/createtasks`
    return this.http.post(urlParm, tasks
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json'),
        responseType: 'json'
      }
    );
  }

}
