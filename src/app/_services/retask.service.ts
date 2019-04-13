import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, } from 'rxjs';
import { DatePipe } from '@angular/common'

import { environment } from '@environments/environment'

import { User, UserUpdateForm, Reward, Task, TaskDateRange, TaskComplete } from '@app/_models'

@Injectable({
  providedIn: 'root'
})
export class ReTaskService {

  constructor(public http: HttpClient,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe) { }

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

  //save a pic to AWS.  This requires a token.
  setAWSPic(pic: File, token: string): Observable<any> {
    let urlParm = `${environment.reTaskUrl}/api/file/upload`

    let formData = new FormData();
    formData.append('file', pic, pic.name);

    return this.http.post(urlParm, formData
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
      }
    );
  }


  //update the user.  This requires a token.
  setPic(pic: File, token: string): Observable<any> {
    let urlParm = `${environment.reTaskUrl}/user/uploadPic`

    let formData = new FormData();


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

    let urlParm = `${environment.reTaskUrl}/user/changePassword`

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


    let urlParm = `${environment.reTaskUrl}/api/getrewardsbyusername`

    return this.http.get(urlParm
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json')
      }
    );
  }


  //update the user.  This requires a token.
  createReward(rewards: Reward[], token: string): Observable<any> {
    let urlParm = `${environment.reTaskUrl}/api/createrewards`

    return this.http.post(urlParm, rewards
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json'),
        responseType: 'json'
      }
    );
  }

  //update the user.  This requires a token.
  deleteReward(reward: Reward, token: string): Observable<any> {
    let urlParm = `${environment.reTaskUrl}/api/deletereward/` + reward.id

    return this.http.delete(urlParm
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json'),
        responseType: 'json'
      }
    );
  }

  // get all the rewards associated with a user
  getTasksByUsername(token: string) {

    let urlParm = `${environment.reTaskUrl}/api/gettasksbyusername`

    return this.http.get(urlParm
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json')
      }
    );
  }

  // get all the rewards associated with a user
  getTasksByUsernameByDate(token: string, startDate: Date, endDate: Date) {

    let dateRange: TaskDateRange = {
      startdate: this.datePipe.transform(startDate, "yyyy-MM-dd"),
      enddate: this.datePipe.transform(endDate, "yyyy-MM-dd")
    }

    //console.log(dateRange.startdate, dateRange.enddate);

    let urlParm = `${environment.reTaskUrl}/api/gettasksbyusernamefordate`
    return this.http.post(urlParm, dateRange
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json'),
        responseType: 'json'
      }
    );

  }

  // get all the open tasks
  getOpenTasks(token: string, startDate: Date, endDate: Date) {

    let dateRange: TaskDateRange = {
      startdate: this.datePipe.transform(startDate, "yyyy-MM-dd"),
      enddate: this.datePipe.transform(endDate, "yyyy-MM-dd")
    }

    //console.log(dateRange.startdate, dateRange.enddate);

    let urlParm = `${environment.reTaskUrl}/api/getopentasks`
    return this.http.post(urlParm, dateRange
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json'),
        responseType: 'json'
      }
    );

  }


  // get all the open tasks
  completeTask(token: string, task_id: number, completeDate: Date) {

    let taskComplete: TaskComplete = {
      task_id: task_id,
      completeDate: this.datePipe.transform(completeDate, "yyyy-MM-dd")
    }

    let urlParm = `${environment.reTaskUrl}/api/updatetaskstatus/true`
    return this.http.post(urlParm, taskComplete
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json'),
        responseType: 'json'
      }
    );

  }

  // get all the open tasks
  updateTask(task: Task, token: string) {

    task.strStartDate = this.datePipe.transform(task.startdate, "yyyy-MM-dd");
    task.strEndDate = this.datePipe.transform(task.enddate, "yyyy-MM-dd");
    let tasks: Task[] = [];
    tasks.push(task);
    //console.log("task to update", task)

    let urlParm = `${environment.reTaskUrl}/api/updatetasks`
    return this.http.post(urlParm, tasks
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json'),
        responseType: 'json'
      }
    );

  }

  // get all the open tasks
  unCompleteTask(token: string, task_id: number, completeDate: Date) {

    let taskComplete: TaskComplete = {
      task_id: task_id,
      completeDate: this.datePipe.transform(completeDate, "yyyy-MM-dd")
    }

    let urlParm = `${environment.reTaskUrl}/api/updatetaskstatus/false`
    return this.http.post(urlParm, taskComplete
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json'),
        responseType: 'json'
      }
    );

  }

  // get all the open tasks
  getCompleteTasks(token: string, startDate: Date, endDate: Date) {

    let dateRange: TaskDateRange = {
      startdate: this.datePipe.transform(startDate, "yyyy-MM-dd"),
      enddate: this.datePipe.transform(endDate, "yyyy-MM-dd")
    }

    //console.log(dateRange.startdate, dateRange.enddate);

    let urlParm = `${environment.reTaskUrl}/api/getcompletetasks`
    return this.http.post(urlParm, dateRange
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json'),
        responseType: 'json'
      }
    );

  }


  //update the user.  This requires a token.
  createTasks(tasks: Task[], token: string): Observable<any> {
    let urlParm = `${environment.reTaskUrl}/api/createtasks`

    return this.http.post(urlParm, tasks
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json'),
        responseType: 'json'
      }
    );
  }

  //update the user.  This requires a token.
  deleteTask(task_id: number, token: string): Observable<any> {
    let urlParm = `${environment.reTaskUrl}/api/deletetask/` + task_id

    return this.http.delete(urlParm
      , {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
          .append('Content-Type', 'application/json'),
        responseType: 'json'
      }
    );
  }




}
