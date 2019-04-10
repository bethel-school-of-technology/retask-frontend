import { Component, OnInit } from '@angular/core';
import { Task, User } from '@app/_models';
import { AuthenticationService, RewardService } from '@app/_services';
import { TaskService } from '@app/_services/task.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  currentDateTime: Date = new Date();
  currentUser: User;
  currentUserSubscription: Subscription;
  taskList: Task[];
  completedTaskList: Task[] = [];
  addTask: Task =
    {
      id: null,
      name: "",
      startdate: new Date(),
      enddate: new Date(),
      dueDate: new Date(),
      level: 0,
      parent_task_id: 0,
      description: "",
      uploads: []
    }

  constructor(
    private authenticationService: AuthenticationService,
    private taskService: TaskService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    // this.loadAllUsers();
    this.getTasks();
  }

  getTasks() {
    console.log(this.currentDateTime);
    this.taskService.getbyUsernamebyDate(this.currentUser, this.currentDateTime, this.currentDateTime)
      .then(tasksIn => {
        this.taskList = tasksIn as Task[];
        console.log(this.taskList);
      });
  }

  OnAddTask() {
    let addTasks: Task[] = [];
    addTasks.push(this.addTask);

    this.taskService.create(addTasks, this.currentUser)
      .then(res => {
        console.log(res)
        this.getTasks();

      });

  }

  prev() {
    this.currentDateTime.setDate(this.currentDateTime.getDate()-1);
    this.getTasks();
  }

  next() {
    this.currentDateTime.setDate(this.currentDateTime.getDate()+1);
    this.getTasks();
  }

  makeComplete (itemComplete, indx) {
    console.log(itemComplete, indx);

    if (itemComplete) {
      this.completedTaskList.push(this.taskList[indx]);
      

      this.taskList.splice(indx,1);
    }

  }

}
