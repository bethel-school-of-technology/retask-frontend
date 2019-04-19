import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AlertRetaskComponent } from './_components';
// import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from '@app/pages/home';
import { LoginComponent } from '@app/pages/login';
import { RegisterComponent } from '@app/pages/register';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CalendarComponent, DialogCalendarTaskDialog } from '@app/pages/calendar/calendar.component';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ForgotpasswordComponent } from '@app/pages/forgotpassword/forgotpassword.component';
import { ForgotusernameComponent } from '@app/pages/forgotusername/forgotusername.component';

import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';
import { UserProfileComponent, DialogPasswordDialog } from './pages/user-profile/user-profile.component';
import { RewardsComponent } from './pages/rewards/rewards.component';
import { Rewards2Component, DialogEditRewardDialog } from './pages/rewards2/rewards2.component';
import { Home2Component } from './pages/home2/home2.component';
import { TasksComponent, DialogEditTaskDialog } from './pages/tasks/tasks.component';

import { HttpErrorInterceptor } from '@app/_guards/http-error.interceptor';

import { DatePipe } from '@angular/common';
import { PopupComponent, DialogOverviewExampleDialog } from './pages/popup/popup.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';

const config = new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('624796833023-clhjgupm0pu6vgga7k5i5bsfp6qp6egh.apps.googleusercontent.com')
        // provider: new GoogleLoginProvider('563025889923-li0ssh373lio431e4m176binneejcqg1.apps.googleusercontent.com')
    },
    // {
    //     id: FacebookLoginProvider.PROVIDER_ID,
    //     provider: new FacebookLoginProvider('561602290896109')
    // },
    // {
    //     id: LinkedInLoginProvider.PROVIDER_ID,
    //     provider: new LinkedInLoginProvider('78iqy5cu2e1fgr')
    // }
]);

export function provideConfig() {
    return config;
}

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        BrowserAnimationsModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        DragDropModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        NgbModalModule,
        FlatpickrModule.forRoot(),
        CommonModule,
        SocialLoginModule
    ],
    declarations: [
        AppComponent,
        AlertRetaskComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        CalendarComponent,
        ForgotpasswordComponent,
        ForgotusernameComponent,
        UserProfileComponent,
        RewardsComponent,
        Rewards2Component,
        Home2Component,
        TasksComponent,
        PopupComponent,
        DialogOverviewExampleDialog,
        DialogEditTaskDialog,
        DialogCalendarTaskDialog,
        DialogEditRewardDialog,
        DialogPasswordDialog

    ],
    entryComponents: [
        DialogOverviewExampleDialog,
        DialogEditTaskDialog,
        DialogCalendarTaskDialog,
        DialogEditRewardDialog,
        DialogPasswordDialog
    ],
    providers: [
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        },
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
        DatePipe
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }

// { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
// { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
