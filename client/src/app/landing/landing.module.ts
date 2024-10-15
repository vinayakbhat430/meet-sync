import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { SharedModule } from '../shared/shared.module';
import { LandingRoutingModule } from './landing-routing.module';
import { FeaturesComponent } from './components/features/features.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { LandingHomeComponent } from './pages/landing-home/landing-home.component';
import { CommonModule } from '@angular/common';

const COMPONENTS = [LandingHomeComponent,LoginComponent, MainComponent, FeaturesComponent, HowItWorksComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [LandingRoutingModule,SharedModule,CommonModule],
})
export class LandingModule {}
