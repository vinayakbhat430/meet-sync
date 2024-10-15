import { Component, signal, Signal } from '@angular/core';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.less'
})
export class HowItWorksComponent {
  howItWorks:Signal<HowItWorks[]> = signal([
    { step: "Sign Up", description: "Create your free Meet-sync account" },
    {
      step: "Set Availability",
      description: "Define when you're available for meetings",
    },
    {
      step: "Share Your Link",
      description: "Send your scheduling link to clients or colleagues",
    },
    {
      step: "Get Booked",
      description: "Receive confirmations for new appointments automatically",
    },
  ])

}

interface HowItWorks{
  step:string;
  description:string;
}
