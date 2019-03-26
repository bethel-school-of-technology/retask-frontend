import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '@app/pages/home';
import { LoginComponent } from '@app/pages/login';
import { RegisterComponent } from '@app/pages/register';   
import { CalendarComponent } from '@app/pages/calendar/calendar.component';
import { ForgotpasswordComponent } from '@app/pages/forgotpassword/forgotpassword.component';
import { ForgotusernameComponent } from '@app/pages/forgotusername/forgotusername.component';
import { AuthGuard } from './_guards';
import { RewardsComponent } from '@app/pages/rewards/rewards.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
    { path: 'rewards', component: RewardsComponent, canActivate: [AuthGuard] },
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