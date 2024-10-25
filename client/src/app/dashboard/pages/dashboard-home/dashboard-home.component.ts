import { Component, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.less'
})
export class DashboardHomeComponent implements OnInit  {
  configService = inject(ConfigService)
  menuList:Signal<MenuItems[]> = signal([
    {icon:'pie-chart',title:'Dashboard'},
    {icon:'calendar',title:'Events'},
    {icon:'user',title:'Meetings'},
    {icon:'clock-circle',title:'Availability'},
  ]);

  selectedMenu:WritableSignal<string> = signal('Dashboard')

  ngOnInit(): void {
      this.configService.fetchUser()
  }

}

interface MenuItems {
  icon:string;
  title:string;
}