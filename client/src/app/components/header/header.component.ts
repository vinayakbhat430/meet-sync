import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less'
})
export class HeaderComponent {
  rotuer = inject(Router)
  navigateToCreateEvent(){
    this.rotuer.navigate(["/create-event"]);
  }

}
