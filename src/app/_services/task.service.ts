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
          resolve(tasks);
        }, err => {
          console.log(err.message);
        });
    });

  }

  getbyUsernamebyDate(user: User, startDate: Date, endDate: Date) {
    return new Promise(resolve => {
      this.reTaskService.getTasksByUsernameByDate(user.accessToken, startDate, endDate)
        .subscribe(tasks => {
          resolve(tasks);
        }, err => {
          console.log(err.message);
        });
    });

  }

  getOpenTasks(user: User, startDate: Date, endDate: Date) {
    return new Promise(resolve => {
      this.reTaskService.getOpenTasks(user.accessToken, startDate, endDate)
        .subscribe(tasks => {
          resolve(tasks);
        }, err => {
          console.log(err.message);
        });
    });

  }

  getCompleteTasks(user: User, startDate: Date, endDate: Date) {
    return new Promise(resolve => {
      this.reTaskService.getCompleteTasks(user.accessToken, startDate, endDate)
        .subscribe(tasks => {
          resolve(tasks);
        }, err => {
          console.log(err.message);
        });
    });

  }

  // mark a task uncomplete
  unCompleteTask(user: User, task_id: number, completeDate: Date) {
    return new Promise(resolve => {
      this.reTaskService.unCompleteTask(user.accessToken, task_id, completeDate)
        .subscribe(tasks => {
          resolve(tasks);
        }, err => {
          console.log(err.message);
        });
    });

  }

  // mark a task complete
  completeTask(user: User, task_id: number, completeDate: Date) {
    return new Promise(resolve => {
      this.reTaskService.completeTask(user.accessToken, task_id, completeDate)
        .subscribe(tasks => {
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
          resolve(tasks);
        }, err => {
          console.log(err.message);
        });
    });
  }

  update(task: Task, user: User) {

    return new Promise(resolve => {
      this.reTaskService.updateTask(task, user.accessToken)
        .subscribe(res => {
          resolve(res);
        }, err => {
          console.log(err.message);
        });
    });
  }

  delete(id: number, user: User) {
    // return this.http.delete(`${environment.apiUrl}/users/${id}`);
    return new Promise(resolve => {
      this.reTaskService.deleteTask(id, user.accessToken)

        .subscribe(res => {
          resolve(res);
        }, err => {
          console.log(err.message);
        });
    });
  }


  getTasksForDateRange(user: User, open: boolean, startDate: Date, endDate: Date) {
    return new Promise(resolve => {
      this.reTaskService.getTasksForDateRange(user.accessToken, open, startDate, endDate)
        .subscribe(tasks => {
          resolve(tasks);
        }, err => {
          console.log(err.message);
        });
    });

  } 
}
