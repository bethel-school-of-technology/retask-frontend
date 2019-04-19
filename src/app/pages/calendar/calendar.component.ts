import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  Inject
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  addMonths,
  subMonths,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  startOfMonth,
  isBefore,
  isAfter,
  isEqual
} from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { AuthenticationService, UserService } from '@app/_services';
import { TaskService } from '@app/_services/task.service';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User, Task, UserUpdateForm } from '@app/_models';
import { environment } from '@environments/environment'

export class MonthsLoaded {
  beginDate: Date;
  endDate: Date;
  loaded: boolean;
}

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  green: {
    primary: '#008000',
    secondary: '#808080'
  }
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    }
    // if you want to add a delete event then use the action below
    // ,
    // {
    //   label: '<i class="fa fa-fw fa-times"></i>',
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     this.events = this.events.filter(iEvent => iEvent !== event);
    //     this.handleEvent('Deleted', event);
    //   }
    // }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  currentUser: User;
  currentUserSubscription: Subscription;

  displayDate: string;
  currentDateTime: Date = new Date();
  todaysDate: Date = new Date();
  taskList: Task[] = [];

  pageLoading: boolean = true;
  reLoading: boolean = false;

  monthsLoadedArray: MonthsLoaded[] = [];

  indxCalendarArray: number;
  todayIndxCalendarArray: number;

  // set this to true to see the debugging at the bottom of the calendar
  // it will display the events in the calendar.
  debugging: boolean = false;

  taskToAdd: Task =
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


  constructor(private modal: NgbModal,
    private authenticationService: AuthenticationService,
    private taskService: TaskService,
    private userService: UserService,
    private datePipe: DatePipe,
    public dialog: MatDialog) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    let holdIndx = `${environment.monthsForCalendar}`

    this.indxCalendarArray = +holdIndx;
    this.todayIndxCalendarArray = this.indxCalendarArray;
  }

  ngOnInit() {
    this.currentDateTime = startOfMonth(new Date())
    this.pageLoading = true;
    this.getMonths();
  }

  getMonths() {

    //return new Promise(resolve => {
    this.displayDate = this.datePipe.transform(this.currentDateTime, "EE MM-dd-yy")

    this.taskService.getDateRangeForCalendar(this.currentUser)
      .then(calendar => {
        this.monthsLoadedArray = calendar as MonthsLoaded[];
        //console.log(this.monthsLoadedArray);
        this.getOpenTasks();
      });

  }

  getOpenTasks() {

    var firstDay = this.monthsLoadedArray[this.indxCalendarArray].beginDate;
    var lastDay = this.monthsLoadedArray[this.indxCalendarArray].endDate;

    this.displayDate = this.datePipe.transform(this.currentDateTime, "EE MM-dd-yy")
    this.taskService.getTasksForDateRange(this.currentUser, true, firstDay, lastDay)
      .then(tasksIn => {
        this.taskList = tasksIn as Task[];
        //console.log(this.taskList);
        this.getCompleteTasks();
      });
  }

  getCompleteTasks() {
    var firstDay = this.monthsLoadedArray[this.indxCalendarArray].beginDate;
    var lastDay = this.monthsLoadedArray[this.indxCalendarArray].endDate;

    this.displayDate = this.datePipe.transform(this.currentDateTime, "EE MM-dd-yy")
    this.taskService.getTasksForDateRange(this.currentUser, false, firstDay, lastDay)
      .then(tasksIn => {
        this.taskList = this.taskList.concat(tasksIn as Task[]);
        this.setupCalendar();
        this.pageLoading = false;
        this.reLoading = false;
      });
  }

  // This sets the calendar with the tasks
  setupCalendar() {
    this.events = [];

    for (let i = 0; i < this.taskList.length; i++) {
      let CalendarEvent = {
        start: new Date(startOfDay(this.taskList[i].dueDate)),
        end: new Date(startOfDay(this.taskList[i].dueDate)),
        title: this.taskList[i].name,
        color: colors.red,
        actions: this.actions,
        allDay: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        draggable: false,
        id: i
      }

      this.setColor(CalendarEvent, this.taskList[i]);

      this.events.push(CalendarEvent);
    }
    this.refresh.next();
  }

  // set the color of the event
  setColor(calendarEvent: CalendarEvent, task: Task) {

    // defualt color
    calendarEvent.color = colors.red;

    if (task.completed) {
      calendarEvent.color = colors.green;
    } else {

      if (isEqual(startOfDay(task.dueDate), startOfDay(this.todaysDate))) {
        calendarEvent.color = colors.yellow;
      }

      if (isAfter(task.dueDate, endOfDay(this.todaysDate))) {
        calendarEvent.color = colors.blue;
      }
    }
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    //this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {

    if (!this.dialogOpen) {
      this.dialogOpen = true;
      this.openDialog(this.taskList[+event.id], false, event);
    }
  }

  addTask(): void {

    if (!this.dialogOpen) {
      this.dialogOpen = true;
      let newTask = new Task();

      this.openAddDialog();
    }
  }


  //this is used by the debugging routine.
  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  // this is called as the previous Today and next buttons are clicked
  closeOpenMonthViewDay(indx: number) {
    if (indx != 0) {
      this.indxCalendarArray = this.indxCalendarArray + indx;
    } else {
      this.indxCalendarArray = this.todayIndxCalendarArray;
    }
    this.reLoading = true;
    this.getOpenTasks();

    this.activeDayIsOpen = false;
  }

  dialogOpen: boolean = false;

  // this opens the dialog box
  openDialog(taskIn: Task, editIn: boolean, calendarEvent: CalendarEvent): void {

    let task: Task = new Task();
    task.id = taskIn.id;
    task.name = taskIn.name;
    task.startdate = taskIn.startdate;
    task.enddate = taskIn.enddate;
    task.points = taskIn.points;
    task.completed = taskIn.completed;

    const dialogRef = this.dialog.open(DialogCalendarTaskDialog, {
      width: '300px',
      data: {
        task: task,
        delTask: false,
        toggleComplete: false,
        addTask: false
      }
    });

    // after the dialog box is closed this is run
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.delTask) {
          //delete the task
          this.taskService.delete(taskIn.id, this.currentUser)
            .then(res => {
              this.reLoading = true;
              this.getOpenTasks();
            });
        } else {
          //console.log(result);
          //console.log("toggleComplete", result.toggleComplete);
          if (result.toggleComplete) {
            if (result.task.completed) {
              // mark as completed
              taskIn.completed = result.task.completed;
              this.taskService.completeTask(this.currentUser, taskIn.id, taskIn.dueDate)
                .then(res => {
                  this.updateUserPoints(taskIn.points)
                  this.setColor(calendarEvent, taskIn);
                });
            } else {
              // mark as uncompleted
              taskIn.completed = result.task.completed;
              this.taskService.unCompleteTask(this.currentUser, taskIn.id, taskIn.dueDate)
                .then(res => {
                  this.updateUserPoints(-taskIn.points)
                  this.setColor(calendarEvent, taskIn);
                });
            }
          } else {
            // update changes
            // edit the task
            taskIn.name = task.name
            taskIn.startdate = task.startdate;
            taskIn.enddate = task.enddate;
            taskIn.points = task.points;

            this.taskService.update(taskIn, this.currentUser)
              .then(res => {
                this.reLoading = true;
                this.getOpenTasks();
              });
          }
        }
      }
      this.dialogOpen = false
    });
  }

  // this opens the dialog box
  openAddDialog(): void {

    const dialogRef = this.dialog.open(DialogCalendarTaskDialog, {
      width: '300px',
      data: {
        task: this.taskToAdd,
        delTask: false,
        toggleComplete: false,
        addTask: true
      }
    });

    // after the dialog box is closed this is run
    dialogRef.afterClosed().subscribe(result => {
      //console.log(result)
      if (result) {
        let addTasks: Task[] = [];
        addTasks.push(result.task);

        this.taskService.create(addTasks, this.currentUser)
          .then(res => {
            this.reLoading = true;
            this.getOpenTasks();
          });
      }
      this.dialogOpen = false
    });
  }

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



@Component({
  selector: 'dialog-edit-task-dialog',
  templateUrl: 'dialog-calendar-task-dialog.html',
})
export class DialogCalendarTaskDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogCalendarTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task, delTask: boolean, toggleComplete: boolean, addTask: boolean }) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}