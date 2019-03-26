import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AlertComponent } from './_components';
//import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from '@app/pages/home';
import { LoginComponent } from '@app/pages/login';
import { RegisterComponent } from '@app/pages/register';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from "./material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CalendarComponent } from '@app/pages/calendar/calendar.component'

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ForgotpasswordComponent } from '@app/pages/forgotpassword/forgotpassword.component';;
import { ForgotusernameComponent } from '@app/pages/forgotusername/forgotusername.component';
import { RewardsComponent } from './pages/rewards/rewards.component'

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
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        CalendarComponent,
        ForgotpasswordComponent
,
        ForgotusernameComponent,
        RewardsComponent
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }

//{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
//{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },