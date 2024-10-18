import { Component, signal, Signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.less'
})
export class DashboardHomeComponent  {
  menuList:Signal<MenuItems[]> = signal([
    {icon:'pie-chart',title:'Dashboard'},
    {icon:'calendar',title:'Events'},
    {icon:'user',title:'Meetings'},
    {icon:'clock-circle',title:'Availability'},
  ]);

  selectedMenu:WritableSignal<string> = signal('Dashboard')

}

interface MenuItems {
  icon:string;
  title:string;
}