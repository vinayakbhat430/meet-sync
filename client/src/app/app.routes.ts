import { Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { CreateMeetingComponent } from './create-meeting/create-meeting.component';
import { JoinEventComponent } from './join-event/join-event.component';

export const routes: Routes = [
    { path:'', loadChildren:() => import('./landing/landing.module').then(m=> m.LandingModule) },
    { path:'dashboard', loadChildren:() => import('./dashboard/dashboard.module').then(m=> m.DashboardModule), canActivate:[AuthGuardService]},
    { path:'join-event/:eventId/:emailId', loadComponent: () => JoinEventComponent, canActivate:[AuthGuardService]},
    { path:'create-meeting/:emailId', loadComponent: ()=> CreateMeetingComponent, canActivate:[AuthGuardService]}
];
