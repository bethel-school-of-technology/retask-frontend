import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
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
import { MatDialog } from '@angular/material';
import { User, Task } from '@app/_models';
import { stringify } from '@angular/core/src/render3/util';
import { now } from 'moment';
import { and } from '@angular/router/src/utils/collection';

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
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    // {
    //   start: subDays(startOfDay(new Date()), 1),
    //   end: addDays(new Date(), 1),
    //   title: 'A 3 day event',
    //   color: colors.red,
    //   actions: this.actions,
    //   allDay: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // },
    // {
    //   start: startOfDay(new Date()),
    //   title: 'An event with no end date',
    //   color: colors.yellow,
    //   actions: this.actions
    // },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   end: addDays(endOfMonth(new Date()), 3),
    //   title: 'A long event that spans 2 months',
    //   color: colors.blue,
    //   allDay: true
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: new Date(),
    //   title: 'A draggable and resizable event',
    //   color: colors.yellow,
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // }
  ];

  activeDayIsOpen: boolean = true;

  currentUser: User;
  currentUserSubscription: Subscription;

  displayDate: string;
  currentDateTime: Date = new Date();
  todaysDate: Date = new Date();
  taskList: Task[] = [];

  constructor(private modal: NgbModal,
    private authenticationService: AuthenticationService,
    private taskService: TaskService,
    private userService: UserService,
    private datePipe: DatePipe,
    public dialog: MatDialog) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.currentDateTime = startOfMonth(new Date())
    console.log("currentDateTime", this.currentDateTime);
    this.getOpenTasks();

  }

  getOpenTasks() {
    var firstDay = new Date(this.currentDateTime.getFullYear(), this.currentDateTime.getMonth(), 1);
    var lastDay = new Date(this.currentDateTime.getFullYear(), this.currentDateTime.getMonth() + 1, 0);

    console.log("lastDay", lastDay);

    console.log(firstDay, lastDay);
    this.displayDate = this.datePipe.transform(this.currentDateTime, "EE MM-dd-yy")
    this.taskService.getTasksForDateRange(this.currentUser, true, firstDay, lastDay)
      .then(tasksIn => {
        this.taskList = tasksIn as Task[];
        console.log(this.taskList);
        this.getCompleteTasks();
      });
  }

  getCompleteTasks() {
    var firstDay = new Date(this.currentDateTime.getFullYear(), this.currentDateTime.getMonth(), 1);
    var lastDay = new Date(this.currentDateTime.getFullYear(), this.currentDateTime.getMonth() + 1, 0);

    console.log(firstDay, lastDay);
    this.displayDate = this.datePipe.transform(this.currentDateTime, "EE MM-dd-yy")
    this.taskService.getTasksForDateRange(this.currentUser, false, firstDay, lastDay)
      .then(tasksIn => {
        console.log(tasksIn);
        this.taskList = this.taskList.concat(tasksIn as Task[]);
        console.log(this.taskList);
        this.setupCalendar();
      });
  }

  setupCalendar() {

    for (let i = 0; i < this.taskList.length; i++) {
      let CalendarEvent = {
        start: new Date(this.taskList[i].dueDate),
        end: new Date(this.taskList[i].dueDate),
        title: this.taskList[i].name,
        color: colors.red,
        actions: this.actions,
        allDay: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        draggable: true
      }

      if (this.taskList[i].completed) {
        CalendarEvent.color = colors.green;
      }

      if (isEqual(startOfDay(this.taskList[i].dueDate), startOfDay(this.todaysDate))) {
        CalendarEvent.color = colors.yellow;
      }

      if (isAfter(this.taskList[i].dueDate,endOfDay(this.todaysDate))) {
        CalendarEvent.color = colors.blue;
      }

      this.events.push(CalendarEvent);
    }
    this.refresh.next();
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
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

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

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}