import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


import { AlertService, UserService, AuthenticationService, ReTaskService } from '@app/_services';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  passwordForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private reTaskService: ReTaskService,
    private route: ActivatedRoute
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }

  }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
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
