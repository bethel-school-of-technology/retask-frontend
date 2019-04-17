import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/_models'

import { AlertService, UserService, AuthenticationService } from '@app/_services';

@Component({
    templateUrl: 'register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    user: User;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    async onSubmit() {
        this.submitted = true;
        let tempUser: any;
        this.user = this.registerForm.value;
        this.user.role = ["user"];

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        tempUser = await this.userService.register(this.user);
        this.loading = false;

        if (tempUser.errorMessage == '') {
            let retVal: any;
            retVal = await this.authenticationService.login(this.f.username.value, this.f.password.value)
            if (retVal.hasOwnProperty('username')) {
                this.user = retVal;
            } else {
                this.user = null;
            }


            this.alertService.success('Registration successful', true);
            this.router.navigate(['/login']);
        }
        else {
            this.alertService.error(tempUser.errorMessage);
            this.loading = false;
        }
    }
}
