import { Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { CreateEventComponent } from './create-event/create-event.component';

export const routes: Routes = [
    { path:'', loadChildren:() => import('./landing/landing.module').then(m=> m.LandingModule) },
    { path:'dashboard', loadChildren:() => import('./dashboard/dashboard.module').then(m=> m.DashboardModule), canActivate:[AuthGuardService]},
    { path:'create-event', loadComponent: () => CreateEventComponent, canActivate:[AuthGuardService]}
];
