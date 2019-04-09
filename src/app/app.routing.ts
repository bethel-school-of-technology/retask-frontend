import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '@app/pages/home';
import { LoginComponent } from '@app/pages/login';
import { RegisterComponent } from '@app/pages/register';
import { CalendarComponent } from '@app/pages/calendar/calendar.component';
import { ForgotpasswordComponent } from '@app/pages/forgotpassword/forgotpassword.component';
import { ForgotusernameComponent } from '@app/pages/forgotusername/forgotusername.component';
import { DemoComponent } from '@app/pages/demo/demo.component';
import { UserProfileComponent } from '@app/pages/user-profile/user-profile.component';

import { AuthGuard } from './_guards';
import { RewardsComponent } from '@app/pages/rewards/rewards.component';
import { Rewards2Component } from '@app/pages/rewards2/rewards2.component';
import { Home2Component } from './pages/home2/home2.component';
import { TasksComponent } from './pages/tasks/tasks.component';


const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'demo', component: DemoComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
    { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard] },
    { path: 'rewards2', component: Rewards2Component, canActivate: [AuthGuard] },
    { path: 'userprofile', component: UserProfileComponent, canActivate: [AuthGuard] },
    {
        path: 'forgotpassword', component: ForgotpasswordComponent,
        data: { callType: 'password', title: 'Forgot Password' }
    },
    {
        path: 'forgotusername', component: ForgotusernameComponent
    },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);