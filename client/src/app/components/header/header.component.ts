import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less'
})
export class HeaderComponent implements OnInit {

  rotuer = inject(Router)
  configService = inject(ConfigService);
  pictureUrl :WritableSignal<string> = signal('')
  navigateToCreateEvent(){
    this.rotuer.navigate(["/create-event"]);
  }

  ngOnInit(): void {
    this.configService.user.subscribe(user=>{
      this.pictureUrl.set(user.picture)
    })
  }

}
