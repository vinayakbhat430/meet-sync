import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { Meeting } from '../../../interfaces';
import { ApiServiceService } from '../../../services/api-service.service';
import { Location } from '@angular/common';
import { CalendarService } from '../../../services/calendar.service';

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

  ngOnInit(): void {
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
          this.messageService.error('Deleted Event successfully!');
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
}
