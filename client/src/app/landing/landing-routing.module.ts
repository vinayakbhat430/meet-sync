import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingHomeComponent } from './pages/landing-home/landing-home.component';

export const routes: Routes = [
    { path:'', component: LandingHomeComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class LandingRoutingModule { }
