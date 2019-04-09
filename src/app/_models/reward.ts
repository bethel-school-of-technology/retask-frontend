import { Upload } from './upload';

export class Reward {
    "id": number;
    "name": string;
    "descr": string;
    "username": string;
    "cost": number;
    "uploads": Upload[];
}
