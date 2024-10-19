import { Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { CreateMeetingComponent } from './create-meeting/create-meeting.component';

export const routes: Routes = [
    { path:'', loadChildren:() => import('./landing/landing.module').then(m=> m.LandingModule) },
    { path:'dashboard', loadChildren:() => import('./dashboard/dashboard.module').then(m=> m.DashboardModule), canActivate:[AuthGuardService]},
    { path:'create-meeting', loadComponent: () => CreateMeetingComponent, canActivate:[AuthGuardService]}
];
