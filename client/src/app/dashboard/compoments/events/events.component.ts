import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { Subject } from 'rxjs';
import { EventsResponse, Meeting, User } from '../../../interfaces';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Location } from '@angular/common';

declare const createGoogleEvent: any;

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.less'
})
export class EventsComponent implements OnInit, OnDestroy{
  apiService = inject(ApiServiceService);

  messageService = inject(NzMessageService);
  modal = inject(NzModalService);
  location = inject(Location)


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

  showDeleteConfirm(eventId:string): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this task?',
      nzContent: '<b style="color: red;">This will permanently delete from database. You cannot undo at later stage!</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteEvent(eventId),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  deleteEvent(eventId:string){
    this.apiService.deleteEvent(eventId).subscribe(res=>{
      this.messageService.error("Deleted Event successfully!");
      this.eventsList.set(this.eventsList().filter(event=> event.id !== eventId))
    });
  }

  copyLink(eventId:string,email:string){
    const url = `${window.location.origin}/join-event/${eventId}/${email}`
    navigator.clipboard.writeText(url);
    this.messageService.info("Copied Link successfully!")
  }



}
