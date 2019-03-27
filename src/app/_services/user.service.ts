import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User, UserUpdateForm } from '@app/_models';
import { ReTaskService } from '@app/_services/retask.service';
import { ApiResponse } from '@app/_models/apiResponse';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient, private reTaskService: ReTaskService) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get(`${environment.apiUrl}/users/${id}`);
    }

    // register the user
    register(user: User) {
        let tempUser = new User
        return new Promise(resolve => {
            this.reTaskService.registerUser(user)
                .subscribe(user => {
                    tempUser.errorMessage = user.errorMessage;
                    resolve(tempUser);
                },
                    err => {
                        tempUser.errorMessage = err.status + " " + err.message;
                        resolve(tempUser);
                    }, () => {
                        tempUser.errorMessage = "";
                        resolve(tempUser);
                    });
        });

    }

    update(user: UserUpdateForm, token: string):Promise<ApiResponse> {
        let dataOut = new ApiResponse;
        return new Promise(resolve => {
            this.reTaskService.updateUser(user, token)
                .subscribe(res => {
                    dataOut.status=0;
                    dataOut.message="ok"
                    resolve(dataOut);
                    
                }, err => {
                    console.log(err.message);
                    let errorStatus = new ApiResponse;
                    errorStatus.status = -1;
                    if (err.status === 400) {
                        errorStatus.message = "Bad Authenication";
                    } else {
                        errorStatus.message = "Error Updating";
                    }
                    console.log(errorStatus);
                    resolve(errorStatus);
                });
        });
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }

    getPic(user: User) {
        let tempPic: any
        return new Promise(resolve => {
            this.reTaskService.getPic(user.accessToken)
                .subscribe(file => {
                    console.log(file)
                    resolve(file);
                }, err => {
                    console.log(err.message);
                });
        });
    }

    setPic(user:User, pic:File) {
        let dataOut = new ApiResponse;
        return new Promise(resolve => {
            this.reTaskService.setPic(pic, user.accessToken)
                .subscribe(res => {
                    dataOut=res;
                    resolve(dataOut);
                }, err => {
                    console.log("in herer");
                    console.log(err.message);
                });
        });
    }

    // reset the password
    resetPassword(password: string, newPassword: string, token: string):Promise<ApiResponse> {
        let dataIs = {
            "password": password,
            "newPassword": newPassword
        }
        let dataOut = new ApiResponse;
        return new Promise(resolve => {
            this.reTaskService.resetPassword(dataIs, token)
                .subscribe(res => {
                    dataOut.status=0;
                    dataOut.message="ok"
                    resolve(dataOut);
                }, err => {
                    console.log(err);
                    let errorStatus = new ApiResponse;
                    errorStatus.status = -1;
                    if (err.status === 400) {
                        errorStatus.message = "Wrong current password";
                    } else {
                        errorStatus.message = "";
                    }
                    console.log(errorStatus);
                    resolve(errorStatus);
                });
        });
    }


    imageToShow: any;
    isImageLoading: boolean;

}