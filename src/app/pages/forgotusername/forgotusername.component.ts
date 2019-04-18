import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService, UserService, AuthenticationService, ReTaskService } from '@app/_services';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotusername.component.html',
  styleUrls: ['./forgotusername.component.css']
})
export class ForgotusernameComponent implements OnInit {
  usernameForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private reTaskService: ReTaskService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }

  }

  ngOnInit() {
    this.usernameForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]]
    })
  }

  //convenience getter for easy access to form fields
  get f() { return this.passwordForm.controls; }

  onSubmit() {
    this.alertService.success(null, false);

    if (this.passwordForm.invalid) {
      this.alertService.success('Invalid Email', true);
      return;
    }

    console.log("Hello");
  }

}
