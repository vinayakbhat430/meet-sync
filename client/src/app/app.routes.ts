import { Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

export const routes: Routes = [
    { path:'', loadChildren:() => import('./landing/landing.module').then(m=> m.LandingModule) },
    { path:'dashboard', loadChildren:() => import('./landing/landing.module').then(m=> m.LandingModule), canActivate:[AuthGuardService]}
];
