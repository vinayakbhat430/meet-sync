import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { Subject } from 'rxjs';
import { EventsResponse } from '../../../interfaces';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.less'
})
export class EventsComponent implements OnInit, OnDestroy{
  apiService = inject(ApiServiceService);

  messageService = inject(NzMessageService);

  private readonly ngUnsubscribe$ = new Subject<void>()

  eventsList:WritableSignal<EventsResponse[]> = signal([]);

  ngOnInit(): void {
    this.apiService.getEvents().subscribe(d=>{
      this.eventsList.set(d)
    })
  }


  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  deleteEvent(eventId:string){
    this.apiService.deleteEvent(eventId).subscribe(res=>{
      this.messageService.error("Deleted Event successfully!");
      this.eventsList.set(this.eventsList().filter(event=> event.id !== eventId))
    });
  }


}
