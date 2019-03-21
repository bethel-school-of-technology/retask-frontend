﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { ReTaskService } from '@app/_services/retask.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient, private reTaskService: ReTaskService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    guestLogin(username: string, password: string) {

        let tempUser = new User;
        if (username==='Guest' && password==='password') {
       
            tempUser.username = 'Guest';
            tempUser.firstName = 'Guest';
            tempUser.lastName = 'User';
            tempUser.id = 99999999999999
            tempUser.role = ['user'];
            tempUser.email = 'GuestUser@test.com';
            tempUser.tokenType = 'Bearer'
            tempUser.accessToken = '&&*()'
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(tempUser));
            this.currentUserSubject.next(tempUser);
        }
        return tempUser;

    }

    login(username: string, password: string) {
        let tempUser = null;
        return new Promise(resolve => {
            this.reTaskService.authenticateUser(username, password)
                .subscribe(user => {
                    //console.log(user)
                    //console.log(user.accessToken)
                    // login successful if there's a jwt token in the response
                    if (user && user.accessToken) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        this.currentUserSubject.next(user);
                    }

                    tempUser = user;
                    resolve(tempUser);
                    return tempUser;

                }, err => {
                    console.log(err)
                }, () => {
                    //console.log("Observer got a complete notification")
                    //console.log(tempUser);
                    return tempUser;
                });
        });

        // here because typecast the User 
        return tempUser;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}