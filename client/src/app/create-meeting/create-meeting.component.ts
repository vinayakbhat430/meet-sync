import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { DateTime, Info } from 'luxon';
import {  Subject,  takeUntil } from 'rxjs';
import { AvailabilityPostInterface, EventsResponse, TimeSlots } from '../interfaces';
import { ApiServiceService } from '../services/api-service.service';
import { SharedModule } from "../shared/shared.module";
import { ActivatedRoute } from '@angular/router';
import { MeetingConfigService } from '../services/meeting-config.service';

@Component({
  selector: 'app-create-meeting',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './create-meeting.component.html',
  styleUrl: './create-meeting.component.less',
})
export class CreateMeetingComponent implements OnInit {
  configService = inject(MeetingConfigService);

  apiService = inject(ApiServiceService);

  route = inject(ActivatedRoute);

  activeDay: WritableSignal<DateTime | null> = signal(null);

  availability: WritableSignal<string[]> = signal([]);
  availableSlots: WritableSignal<AvailabilityPostInterface[]> = signal([]);

  availableTimeForSelectedDay = {
    startTime: '9:30 AM',
    endTime: '6:00 PM',
  };

  showNext: WritableSignal<boolean> = signal(false);
  selectedTimeSlots: WritableSignal<TimeSlots[]> = signal([]);

  maxSlots:WritableSignal<number> =signal(100);
  eventData: WritableSignal<EventsResponse|undefined> = signal(undefined);

  private readonly ngUnsubscribe$ = new Subject<void>();
  eventId: any;
  emailId: any;

  ngOnInit(): void {
    this.getParamsAndFetchAvailability()
    this.configService.availability
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((d) => {
        if (d) {
          this.availableSlots.set(d.days);
          const weekDays = Info.weekdays()
            .map((weekDay) => {
              const foundDay = d.days.find((day) => day.day === weekDay);
              if (foundDay) {
                return undefined;
              } else {
                return weekDay;
              }
            })
            .filter((day) => !!day) as string[];
          this.availability.set(weekDays);
        }
      });
  }

  getParamsAndFetchAvailability(){
    this.route.params.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((params) => {
      this.eventId = params['eventId']; // Fetch eventId from route params
      this.emailId = params['emailId']; // Fetch emailId from route params

      // Use emailId to fetch availability if available
      this.configService.fetchAvailabilityByEmail(this.emailId);
      this.getEventById(this.eventId)
    });
  }

  getEventById(eventId:string) {
    this.apiService.getEventsById(eventId).pipe(takeUntil(this.ngUnsubscribe$)).subscribe(event=>{
      this.eventData.set(event)
      this.maxSlots.set(event.duration/30);
    })
  }

  selectedDay(day: DateTime) {
    this.activeDay.set(day);
    const selectedDay = this.availableSlots().find(
      (d) => d.day === day.weekdayLong
    );
    if (selectedDay) {
      this.availableTimeForSelectedDay = {
        startTime: selectedDay.startTime,
        endTime: selectedDay.endTime,
      };
    }
  }

  slotsBooked(data: TimeSlots[]) {
    this.showNext.set(true);
    this.selectedTimeSlots.set(data);
  }

  goToPrevious() {
    this.showNext.set(false);
  }
}
