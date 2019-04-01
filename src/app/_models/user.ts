export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    tokenType: string;
    accessToken: string;
    errorMessage: string;
    phoneNbr: string;
    points: number;
    role: string[];
}

// if you want the field to be update on the database - added it here also
export class UserUpdateForm {
    firstName: string;
    lastName: string;
    phoneNbr: string;
}