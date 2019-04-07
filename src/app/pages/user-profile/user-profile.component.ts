import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { User, UserUpdateForm } from '@app/_models/user';
import { AuthenticationService, UserService, AlertService } from '@app/_services';
import { ApiResponse } from '@app/_models/apiResponse';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  submitted = false;
  currentUser: User;
  currentUserSubscription: Subscription;
  imageSubscription: Subscription;

  registerForm: FormGroup;

  imageToShow: any;
  isImageLoading: boolean = true;
  editForm: boolean = false;

  changeImage: boolean = false;

  // fields for changing password
  changePasswordOn: boolean = false;
  oldPassword: string;
  errorMsg: string;
  newPassword: string;
  confirmNewPassword: string;
  apiResults: ApiResponse;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private alertService: AlertService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: [{ value: this.currentUser.firstName, disabled: true }, Validators.required],
      lastName: [{ value: this.currentUser.lastName, disabled: true }, Validators.required],
      phoneNbr: [{ value: this.currentUser.phoneNbr, disabled: true }, Validators.required],
      email: [{ value: this.currentUser.email, disabled: true }, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]]
    });

    this.getPic();

    


  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  onSubmit() {}

  getPic() {
  // Get the image 
  this.isImageLoading = true;

  this.userService.getPic(this.currentUser)
    .then(blobIn => {
      // creating the url to display the image from the Blob passed by the API
      this.imageToShow = URL.createObjectURL(blobIn);
      let urlCreator = window.URL;
      this.imageToShow = this.sanitizer.bypassSecurityTrustUrl(
        urlCreator.createObjectURL(blobIn));
      this.isImageLoading = false;
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  saveUser() {
    this.alertService.clear();
    let tempUser = new UserUpdateForm;
    tempUser.firstName = this.registerForm.controls['firstName'].value;
    tempUser.lastName = this.registerForm.controls['lastName'].value;
    tempUser.phoneNbr = this.registerForm.controls['phoneNbr'].value;

    this.userService.update(tempUser, this.currentUser.accessToken)
      .then(res => {
        this.apiResults = res;
        if (this.apiResults.status === 0) {
          // update the stored user information once the update is complete
          this.currentUser.firstName = tempUser.firstName;
          this.currentUser.lastName = tempUser.lastName;
          this.currentUser.phoneNbr = tempUser.phoneNbr;

          // disable editing
          this.editForm = false;
          this.registerForm.controls['firstName'].disable();
          this.registerForm.controls['lastName'].disable();
          this.registerForm.controls['phoneNbr'].disable();

          this.alertService.success("Saved");
        } else {
          this.alertService.error(this.apiResults.message);
        }
      });

  }

  editUser() {
    this.editForm = true;
    this.registerForm.controls['firstName'].enable();
    this.registerForm.controls['lastName'].enable();
    this.registerForm.controls['phoneNbr'].enable();
    this.alertService.clear();
  }

  changePassword() {
    this.changePasswordOn = true;
    this.alertService.clear();
  }

  savePassword(save: boolean) {

    if (save) {

      if (this.newPassword!==this.confirmNewPassword) {
        this.alertService.error("New Password and Confirm New Password are not equal");
        return;
      }
  
      if (this.newPassword.length<6) {
        this.alertService.error("New Password must be at least 6 characters");
        return;
      }

      this.userService.resetPassword(this.oldPassword, this.newPassword, this.currentUser.accessToken)
        .then(res => {
          this.apiResults = res;
          if (this.apiResults.status === 0) {
            this.oldPassword = "";
            this.newPassword = "";
            this.confirmNewPassword = "";
            this.changePasswordOn = false;
            this.alertService.success("Password Changed");
          } else {
            this.alertService.error(this.apiResults.message);
          }
        });
    } else {
      this.oldPassword = "";
      this.newPassword = "";
      this.confirmNewPassword = "";
      this.changePasswordOn = false;
      this.alertService.clear();
    }
  }

  selectedFile = null;

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    // was in seperate events
    this.userService.setPic(this.currentUser, this.selectedFile)
        .then(res => {
          console.log(res);
          this.apiResults = <ApiResponse>res;
          if (this.apiResults.status === 0) {
            
            this.changePasswordOn = false;
            this.alertService.success("Image Changed");
            this.getPic();
          } else {
            console.log("In here user-profile")
            this.alertService.error(this.apiResults.message);
          }
          this.changeImage=false;
        });

  }

  changeImageFunc() {
    this.changeImage=true;
  }

}