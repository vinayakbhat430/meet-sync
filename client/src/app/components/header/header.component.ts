import { Component, HostListener, inject, OnInit, signal, WritableSignal } from '@angular/core';
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
  isMobileView = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkViewport();
  }

  checkViewport(): void {
    this.isMobileView = window.innerWidth <= 768; // Set to true for devices with width <= 768px
  }
  

  ngOnInit(): void {
    this.configService.user.subscribe(user=>{
      console.log("Got user", user)
      this.pictureUrl.set(user.picture)
      this.isLoggedIn.set(!!user.email)
    });
    this.checkViewport()
  }

  openCreateEvent(){
    this.isCreateEvent =true ;
  }

  navigateToDashboard(){
    this.router.navigate(["/dashboard"])
  }

  navigateToLanding(){
    this.router.navigate(["/"])
  }

}
