import { Component, OnInit, Inject, OnChanges } from '@angular/core';
import { Task, User, UserUpdateForm } from '@app/_models';
import { AuthenticationService, UserService } from '@app/_services';
import { TaskService } from '@app/_services/task.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { startOfDay } from 'date-fns';

export interface TaskDialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  panelOpenState = false;
  dateWork = new Date();

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
      strStartDate: "",
      strEndDate: "",
      completed: false,
      uploads: []
    }

  animal: string;
  name: string;

  constructor(
    private authenticationService: AuthenticationService,
    private taskService: TaskService,
    private userService: UserService,
    private datePipe: DatePipe,
    public dialog: MatDialog,

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

  // this opens the dialog box
  openDialog(taskIn: Task, editIn: boolean): void {

    let task: Task = new Task();

    task.name = taskIn.name
    task.startdate = taskIn.startdate;
    task.enddate = taskIn.enddate;
    task.points = taskIn.points;

    const dialogRef = this.dialog.open(DialogEditTaskDialog, {
      width: '255px',
      data: {
        task: task,
        edit: editIn
      }
    });

    // after the dialog box is closed this is run
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (editIn) {
          // edit the task
          taskIn.name = task.name
          taskIn.startdate = task.startdate;
          taskIn.enddate = task.enddate;
          taskIn.points = task.points;

          this.taskService.update(taskIn, this.currentUser)
            .then(res => {
              this.getTasks();
            });
        } else {
          //delete the task
          this.taskService.delete(taskIn.id, this.currentUser)
            .then(res => {
              this.getTasks();
            });
        }
      }
    });
  }


  getTasks() {
    this.displayDate = this.datePipe.transform(this.currentDateTime, "EE MM-dd-yy")
    this.taskService.getOpenTasks(this.currentUser, this.currentDateTime, this.currentDateTime)
      .then(tasksIn => {
        this.taskList = tasksIn as Task[];
      });
  }

  getCompleteTasks() {
    this.taskService.getCompleteTasks(this.currentUser, this.currentDateTime, this.currentDateTime)
      .then(tasksIn => {
        this.completedTaskList = tasksIn as Task[];
      });

  }

  OnAddTask() {
    let addTasks: Task[] = [];
    addTasks.push(this.addTask);

    this.taskService.create(addTasks, this.currentUser)
      .then(res => {
        this.getTasks();
      });

  }

  cnt = 0;

  prev() {
    this.currentDateTime.setDate(this.currentDateTime.getDate() - 1);
    this.displayDate = this.datePipe.transform(this.currentDateTime, "EE MM-dd-yy");
    this.addTask.startdate = startOfDay(this.currentDateTime);
    this.addTask.enddate = startOfDay(this.currentDateTime);
    this.cnt--;
    this.getTasks();
    this.getCompleteTasks();
  }

  next() {
    this.currentDateTime.setDate(this.currentDateTime.getDate() + 1);
    this.displayDate = this.datePipe.transform(this.currentDateTime, "EE MM-dd-yy");
    this.addTask.startdate = startOfDay(this.currentDateTime);
    this.addTask.enddate = startOfDay(this.currentDateTime);
    this.cnt++;
    this.getTasks();
    this.getCompleteTasks();
  }

  makeComplete(itemComplete, indx) {

    let holdPoints = this.taskList[indx].points;

    if (itemComplete) {

      this.taskService.completeTask(this.currentUser, this.taskList[indx].id, this.currentDateTime)
        .then(res => {
          this.updateUserPoints(holdPoints);

          this.completedTaskList.push(this.taskList[indx]);
          this.taskList.splice(indx, 1);

        });
    }
  }

  makeUnComplete(itemComplete, indx) {

    let holdPoints = this.completedTaskList[indx].points;

    if (!itemComplete) {

      this.taskService.unCompleteTask(this.currentUser, this.completedTaskList[indx].id, this.currentDateTime)
        .then(res => {
          // subtract the points from the user's points
          this.updateUserPoints((holdPoints * -1));
          this.taskList.push(this.completedTaskList[indx]);
          this.completedTaskList.splice(indx, 1);

        });


    }
  }

  // negitive will decrease points if a task is marked uncomplete
  updateUserPoints(points) {
    // add points to the accumulated points
    this.currentUser.points = this.currentUser.points + points;

    let tempUser = new UserUpdateForm;
    tempUser.firstName = this.currentUser.firstName;
    tempUser.lastName = this.currentUser.lastName;
    tempUser.phoneNbr = this.currentUser.phoneNbr;
    tempUser.points = this.currentUser.points;

    this.userService.update(tempUser, this.currentUser.accessToken)
      .then(res => {
        if (res.status == 0) {
          this.authenticationService.saveLocally(this.currentUser);
        }
        else {
          this.currentUser.points = this.currentUser.points - points;
        }
      });
  }

}



/** Component to popup a dialog to edit a Task
 * 
*/
@Component({
  selector: 'dialog-edit-task-dialog',
  templateUrl: 'dialog-edit-task-dialog.html',
})
export class DialogEditTaskDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogEditTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task, edit: boolean }) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
