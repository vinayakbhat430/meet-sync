import {
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { EventDetails, Meeting } from '../../../interfaces';
import { ApiServiceService } from '../../../services/api-service.service';
import { Location } from '@angular/common';
import { CalendarService } from '../../../services/calendar.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { formatDateToGoogleDateTime } from '../../../shared/time-slots.util';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.less',
})
export class MeetingsComponent implements OnInit {
  apiService = inject(ApiServiceService);

  messageService = inject(NzMessageService);
  calendarService = inject(CalendarService);
  modal = inject(NzModalService);
  location = inject(Location);

  private readonly ngUnsubscribe$ = new Subject<void>();

  meetingList: WritableSignal<Meeting[]> = signal([]);

  listOfMeeting: Signal<Meeting[]> = computed(() => {
    const filterFn =
      this.radioSignal() === 'Upcoming'
        ? (m: Meeting) => new Date(m.startTime).getTime() >= new Date().getTime()
        : (m: Meeting) => new Date(m.startTime).getTime() < new Date().getTime();
    return this.meetingList().filter(filterFn);
  });

  selectedMeeting: WritableSignal<Meeting|undefined> = signal(undefined)

  radioValue: 'Upcoming' | 'Completed' = 'Upcoming';
  radioSignal: WritableSignal<'Upcoming' | 'Completed'> = signal('Upcoming');

  isVisible=false;

  meetingform:FormGroup;
  constructor(private fb:FormBuilder){
    this.meetingform = this.fb.group({
      title:['', Validators.required],
      description:['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getListOfMeetings()
  }

  getListOfMeetings(){
    this.apiService.getMeetings().subscribe((d) => {
      this.meetingList.set(d);
    });
  }
  showDeleteConfirm(eventId: string, googleEventId: string): void {
    this.modal.confirm({
      nzTitle: 'Are you sure cancel this meeting?',
      nzContent:
        '<b style="color: red;">This will permanently delete from database. You cannot undo at later stage!</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteEvent(eventId, googleEventId),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  deleteEvent(eventId: string, googleEventId: string) {
    this.calendarService
      .deleteEvent(googleEventId)
      .then((e) => {
        this.apiService.deleteBooking(eventId).subscribe((res) => {
          this.meetingList.set(
            this.meetingList().filter((event) => event.id !== eventId)
          );
        });
      })
      .catch((err) => {
        this.messageService.error('Failed to cancel event');
      });
  }

  joinMeeting(meetingLink: string) {
    window.open(meetingLink, '_blank');
  }

  updateTheList() {
    this.radioSignal.set(this.radioValue);
  }
  editMeeting(meeting:Meeting){
    this.isVisible=true
    this.selectedMeeting.set(meeting)
    this.meetingform.get('title')?.setValue(meeting.name);
    this.meetingform.get('description')?.setValue(meeting.additionalInfo);
  }

  async updateEvent(meeting:Meeting| undefined){
    console.log(meeting)
    if(!meeting){
      this.messageService.error("Unable to update meeting at the moment!")
    }
    else{
      
      const formData = this.meetingform.getRawValue() as MeetingModal;
      
      const eventDetails: EventDetails = {
        summary: formData.title,
        description: formData.description,
        startTime: formatDateToGoogleDateTime(new Date(meeting.startTime)),
        endTime: formatDateToGoogleDateTime(new Date(meeting.endTime)),
        email: meeting.attendees.map(a => ({email: a})),
        startDate:new Date(meeting.startTime),
        endDate: new Date(meeting.endTime),
        slot: meeting.slot,
        id:meeting.id
      };
      console.log("Calling update event service!");
      await this.calendarService.updateGoogleEvent(meeting.googleEventId,eventDetails).then(e=>{
        this.meetingform.reset();
        this.getListOfMeetings();
      }).catch(e=>{
        
      });
    }
  }
}

interface MeetingModal {
  title:string;
  description:string;
}