import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Task } from '@app/_models/task';
import { ReTaskService } from '@app/_services/retask.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  taskList

  constructor(private http: HttpClient, private reTaskService: ReTaskService) { }

  getAll() {
    //return this.http.get<Task[]>(`${environment.apiUrl}/users`);
  }

  getAllbyUsername(username: string) {

    let mockTasks: Task[];

    mockTasks = [
      {
        id: 1,
        startdate: new Date(),
        enddate: new Date(),
        level: 1,
        parent_task_id: 0,
        description: "Feed horses on time"

      },
      {
        id: 2,
        startdate: new Date(),
        enddate: new Date(),
        level: 1,
        parent_task_id: 0,
        description: "Clean stalls on time"
      }
    ]

    return mockTasks

  }

  getById(id: number) {
    //return this.http.get(`${environment.apiUrl}/users/${id}`);
  }

  create(task: Task) {
    //return this.http.put(`${environment.apiUrl}/users/${task.id}`, task);
  }

  update(task: Task) {
    //return this.http.put(`${environment.apiUrl}/users/${task.id}`, task);
  }

  delete(id: number) {
    //return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
}
