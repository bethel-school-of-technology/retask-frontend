import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ViewEncapsulation,
  Inject,
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
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { Task } from '@app/_models';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogEditTaskDialog } from '../tasks/tasks.component';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';
import { TaskService } from '@app/_services/task.service';

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
  }
};

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None, // hack to get the styles to apply locally
  styleUrls: ['demo.component.css'],
  templateUrl: 'demo.component.html',
  // styles: [
  //   `
  //     .my-custom-class span {
  //       color: #191970 !important;
  //     }
  //   `
  // ]
})
export class DemoComponent implements OnInit {
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
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true,
      cssClass: 'my-custom-class',
      id: "3"
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions,
      id: "3"
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
      id: "3"
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: new Date(),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true,
      id: "3"
    }
  ];


  activeDayIsOpen: boolean = true;

  constructor(private taskService: TaskService,
    public dialog: MatDialog) { }

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


  ngOnInit() {
    this.test();
  }

  test() {

    for (let i = 0; i < this.events.length; i++) {
      console.log("event.id", this.events[i].id);
    }

  }

  handleEvent(action: string, event: CalendarEvent): void {

   //if (!this.dialogOpen)
   console.log(event.id);
      //this.taskService.getById(event.id),
      this.openDialog(new Task(), false);
    //this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'lg' });
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

  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log(event);
    console.log('Event clicked', event);
  }

  dialogOpen: boolean = false;

  // this opens the dialog box
  openDialog(taskIn: Task, editIn: boolean): void {

    console.log("in open dialog");
    this.dialogOpen = true;

    let task: Task = new Task();

    task.name = taskIn.name
    task.startdate = taskIn.startdate;
    task.enddate = taskIn.enddate;
    task.points = taskIn.points;

    const dialogRef = this.dialog.open(DialogDemoDialog, {
      width: '255px',
      data: {
        task: task,
        edit: editIn
      }
    });

    // after the dialog box is closed this is run
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.dialogOpen = false;
        if (editIn) {
          // edit the task
          taskIn.name = task.name
          taskIn.startdate = task.startdate;
          taskIn.enddate = task.enddate;
          taskIn.points = task.points;

          // this.taskService.update(taskIn, this.currentUser)
          //   .then(res => {
          //     this.getTasks();
          //   });
        } else {
          //delete the task
          // this.taskService.delete(taskIn.id, this.currentUser)
          //   .then(res => {
          //     this.getTasks();
          //   });
        }
      }
    });
  }
}

@Component({
  selector: 'dialog-edit-task-dialog',
  templateUrl: 'dialog-edit-task-dialog.html',
})
export class DialogDemoDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogEditTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task, edit: boolean }) { }

  onNoClick(): void {
    this.dialogRef.close({ changedmade: false });
  }

}