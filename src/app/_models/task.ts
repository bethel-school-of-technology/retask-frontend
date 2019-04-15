import { Upload } from './upload';

export class Task {
    id: number;
    name: string;
    startdate: Date;
    enddate: Date;
    level: number;
    dueDate: Date;
    points: number;
    username: string;
    parent_task_id: number;
    description: string;
    strStartDate: string;
    strEndDate: string;
    completed: boolean;
    uploads: Upload[];
}

export class TaskDateRange {
    startdate: string;
    enddate: string;
}

export class TaskComplete {
    task_id: number;
    completeDate: string;
}
