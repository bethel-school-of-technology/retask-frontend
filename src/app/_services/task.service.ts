import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Task, User } from '@app/_models';
import { ReTaskService } from '@app/_services/retask.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  taskList;

  constructor(private http: HttpClient, private reTaskService: ReTaskService) { }

  getAll() {
    // return this.http.get<Task[]>(`${environment.apiUrl}/users`);
  }

  getAllbyUsername(user: User) {
    return new Promise(resolve => {
      this.reTaskService.getTasksByUsername(user.accessToken)
        .subscribe(tasks => {

          console.log(tasks)

          resolve(tasks);
        }, err => {
          console.log(err.message);
        });
    });

  }

  getbyUsernamebyDate(user: User, startDate: Date, endDate: Date) {
    return new Promise(resolve => {
      this.reTaskService.getTasksByUsernameByDate(user.accessToken,startDate, endDate)
        .subscribe(tasks => {

          console.log(tasks)

          resolve(tasks);
        }, err => {
          console.log(err.message);
        });
    });

  }

  getById(id: number) {
    // return this.http.get(`${environment.apiUrl}/users/${id}`);
  }

  create(tasks: Task[], user: User) {
      return new Promise(resolve => {
        this.reTaskService.createTasks(tasks, user.accessToken)

          .subscribe(tasks => {
            console.log(tasks)

            resolve(tasks);
          }, err => {
            console.log(err.message);
          });
      });
  }

  update(task: Task) {
    // return this.http.put(`${environment.apiUrl}/users/${task.id}`, task);
  }

  delete(id: number) {
    // return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
}
