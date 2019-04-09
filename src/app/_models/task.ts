import { Upload } from './upload';

export class Task {
    id: number;
    startdate: Date;
    enddate: Date;
    level: number;
    parent_task_id: number;
    description: string;
    uploads: Upload[];                       
}
