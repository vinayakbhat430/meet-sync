import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/config.service';
import { CreateEventComponent } from "../create-event/create-event.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SharedModule, CreateEventComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less'
})
export class HeaderComponent implements OnInit {
  configService = inject(ConfigService);
  router = inject(Router);
  pictureUrl :WritableSignal<string> = signal('');

  isCreateEvent = false;
  isLoggedIn: WritableSignal<boolean> = signal(false);
  

  ngOnInit(): void {
    this.configService.user.subscribe(user=>{
      this.pictureUrl.set(user.picture)
      this.isLoggedIn.set(!!user.email)
    })
  }

  openCreateEvent(){
    this.isCreateEvent =true ;
  }

  navigateToDashboard(){
    this.router.navigate(["/dashboard"])
  }

}
