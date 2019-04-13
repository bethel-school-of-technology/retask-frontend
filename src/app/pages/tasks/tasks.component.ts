import { Component, OnInit } from '@angular/core';
import { Task, User } from '@app/_models';
import { AuthenticationService, RewardService } from '@app/_services';
import { TaskService } from '@app/_services/task.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  dateWork =new Date();

  currentDateTime: Date = new Date();
  displayDate: any;
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
      points: 0,
      username: "",
      parent_task_id: 0,
      description: "",
      uploads: []
    }

  constructor(
    private authenticationService: AuthenticationService,
    private taskService: TaskService,
    private datePipe: DatePipe
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    // this.loadAllUsers();
    this.getTasks();
    this.getCompleteTasks();
  }

  getTasks() {
    console.log(this.currentDateTime);
    this.displayDate = this.datePipe.transform(this.currentDateTime, "EE MM-dd-yy")
    this.taskService.getOpenTasks(this.currentUser, this.currentDateTime, this.currentDateTime)
      .then(tasksIn => {
        this.taskList = tasksIn as Task[];
        console.log(this.taskList);
      });
  }

  getCompleteTasks() {
    console.log(this.currentDateTime);
    this.taskService.getCompleteTasks(this.currentUser, this.currentDateTime, this.currentDateTime)
      .then(tasksIn => {
        this.completedTaskList = tasksIn as Task[];
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

  cnt = 0;

  prev() {
    this.currentDateTime.setDate(this.currentDateTime.getDate()-1);
    this.displayDate = this.datePipe.transform(this.currentDateTime, "EE MM-dd-yy")
    this.cnt--;
    this.getTasks();
    this.getCompleteTasks();
  }

  next() {
    this.currentDateTime.setDate(this.currentDateTime.getDate()+1);
    this.displayDate = this.datePipe.transform(this.currentDateTime, "EE MM-dd-yy")
    this.cnt++;
    this.getTasks();
    this.getCompleteTasks();
  }

  makeComplete (itemComplete, indx) {
    console.log(itemComplete, indx);

    if (itemComplete) {

      this.taskService.completeTask(this.currentUser,this.taskList[indx].id, this.currentDateTime)
      .then(res => {
        console.log(res);
        this.completedTaskList.push(this.taskList[indx]);
        this.taskList.splice(indx,1);

      });

      
    }

  }

}
