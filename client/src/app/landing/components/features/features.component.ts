import { Component, Signal,signal } from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrl: './features.component.less'
})
export class FeaturesComponent {
  features:Signal<Features[]>= signal( [
    {
      icon:'calendar',
      title:'Create Events',
      description:'Easily setup and customize your event types.'
    },
    {
      icon:'clock-circle',
      title:'Manage Availability',
      description:'Define your availability and streamline scheduling.'
    },
    {
      icon:'link',
      title:'Custom Links',
      description:'Share your personalized scheduling link to prople.'
    },
    {
      icon:'vertical-align-middle',
      title: 'No Conflicts',
      description:'Avoid conflicts by letting others know timeslot is already booked!.'
    }
  ])
}


interface Features{
  icon:string;
  title:string;
  description:string
}