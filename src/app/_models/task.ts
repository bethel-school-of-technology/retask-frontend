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
    uploads: Upload[];
}

export class TaskDateRange {
    startdate: string;
    enddate: string;
}
