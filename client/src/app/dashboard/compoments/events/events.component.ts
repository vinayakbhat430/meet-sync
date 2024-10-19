import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { Subject } from 'rxjs';
import { EventsResponse, Meeting, User } from '../../../interfaces';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CalendarService } from '../../../services/calendar.service';
import { NzModalService } from 'ng-zorro-antd/modal';

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

  // createMeeting(){
  //   const dummyMeeting1: Meeting = {
  //     eventId: 'event-123',
  //     userId: 'user-001',
  //     name: 'John Doe',
  //     email: 'vinayakbhat430.learn@gmail.com',
  //     additionalInfo: 'Looking forward to this meeting!',
  //     startTime: new Date('2024-10-20T09:00:00Z'),
  //     endTime: new Date('2024-10-20T09:30:00Z'),
  //   };
  //   const dummyEventResponse: EventsResponse = {
  //     id: 'event-123',
  //     title: 'Team Meeting',
  //     description: 'A meeting to discuss the project progress and next steps.',
  //     duration: 30,  // in minutes
  //     email: 'vinayakbhat430.signups@gmail.com',
  //     isPrivate: false,
  //     bookings: []
  //   };
  //   const user:User={
  //     email: 'vinayakbhat430.signups@gmail.com',
  //     id: '',
  //     picture: ''
  //   }

  //   const startTime = new Date('2024-10-20T09:00:00Z').toISOString().slice(0, 18) + '-07:00';
  //   const endTime = new Date('2024-10-20T09:30:00Z').toISOString().slice(0, 18) + '-07:00';
  //   const eventDetails = {
  //     email: 'vinayakbhat430.signups@gmail.com',
  //     startTime: startTime,
  //     endTime: endTime,
  //   };
  //   console.info(eventDetails);
  //   //this.generateICSFile()
  //   createGoogleEvent(eventDetails);
  //   // this.calendar.createBooking(dummyMeeting1,dummyEventResponse, user)
  // }

  createMeeting() {
    const eventDetails = {
      summary: 'My Meeting',
      location: '800 Howard St., San Francisco, CA',
      description: 'Meeting description',
      startTime: '2024-10-15T10:00:00',
      endTime: '2024-10-15T12:00:00',
      email: 'attendee@example.com',
    };

    // this.calendar.createGoogleEvent(eventDetails).then(() => {
    //   console.log('Event Created!');
    // });
  }


}
