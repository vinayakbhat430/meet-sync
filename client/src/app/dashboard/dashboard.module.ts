import { inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';
import { SharedModule } from '../shared/shared.module';
import { AvailabilityComponent } from './compoments/availability/availability.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventsComponent } from './compoments/events/events.component';
import { MeetingsComponent } from './compoments/meetings/meetings.component';
import { DashboardComponent } from './compoments/dashboard/dashboard.component';
import { ConfigService } from '../services/config.service';

const COMPONENTS = [ DashboardHomeComponent, AvailabilityComponent, EventsComponent, MeetingsComponent, DashboardComponent]

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    SharedModule,
  ]
})
export class DashboardModule { 
  config = inject(ConfigService);
}
