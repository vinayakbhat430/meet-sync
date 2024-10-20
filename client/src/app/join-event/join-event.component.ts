import { Component, inject, signal, WritableSignal } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ActivatedRoute } from '@angular/router';
import { DateTime, Info } from 'luxon';
import { single, Subject, takeUntil } from 'rxjs';
import {
  AvailabilityPostInterface,
  TimeSlots,
  EventsResponse,
  User,
  EventDetails,
} from '../interfaces';
import { ApiServiceService } from '../services/api-service.service';
import { MeetingConfigService } from '../services/meeting-config.service';
import { CalendarService } from '../services/calendar.service';
import { ConfigService } from '../services/config.service';
import { formatDateToGoogleDateTime } from '../shared/time-slots.util';

const THIRTY_MINUTES_IN_MS = 30 * 60 * 1000


@Component({
  selector: 'app-join-event',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './join-event.component.html',
  styleUrl: './join-event.component.less',
})
export class JoinEventComponent {
  configService = inject(MeetingConfigService);
  commonConfigService = inject(ConfigService);

  apiService = inject(ApiServiceService);

  calendarService = inject(CalendarService);

  route = inject(ActivatedRoute);

  activeDay: WritableSignal<DateTime | null> = signal(null);
  user: WritableSignal<User> = signal({ id: '', email: '', picture: '' });

  availability: WritableSignal<string[]> = signal([]);
  availableSlots: WritableSignal<AvailabilityPostInterface[]> = signal([]);

  availableTimeForSelectedDay = {
    startTime: '9:30 AM',
    endTime: '6:00 PM',
  };

  bookedSlots:string[] = [];

  showNext: WritableSignal<boolean> = signal(false);
  selectedTimeSlots: WritableSignal<TimeSlots[]> = signal([]);

  maxSlots: WritableSignal<number> = signal(100);
  eventData: WritableSignal<EventsResponse | undefined> = signal(undefined);

  private readonly ngUnsubscribe$ = new Subject<void>();
  eventId: any;
  emailId: any;

  ngOnInit(): void {
    this.calendarService.initializeGapiClient();
    this.calendarService.initializeGisClient();
    this.getCurrentUser();
    this.getParamsAndFetchAvailability();
    this.getAvailability();
    this.getBookedSlots();
  }

  getBookedSlots(){
    this.configService.bookedSlots.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(slots=>{
      this.bookedSlots= slots;
    })
  }

  getAvailability() {
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

  getCurrentUser() {
    this.commonConfigService.user
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((user) => {
        if (user) {
          this.user.set(user);
        }
      });
  }

  getParamsAndFetchAvailability() {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((params) => {
        this.eventId = params['eventId']; // Fetch eventId from route params
        this.emailId = params['emailId']; // Fetch emailId from route params

        // Use emailId to fetch availability if available
        this.configService.fetchAvailabilityByEmail(this.emailId);
        this.getEventById(this.eventId);
      });
  }

  getEventById(eventId: string) {
    this.apiService
      .getEventsById(eventId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((event) => {
        this.eventData.set(event);
        this.maxSlots.set(event.duration / 30);
      });
  }

  selectedDay(day: DateTime) {
    this.activeDay.set(day);
    this.configService.getCurrentDayBookedSlots(this.eventData()?.email!,this.activeDay()!.toISODate()||'')

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

  joinEvent() {
    const startTime = new Date(
      `${this.activeDay()?.toISODate()} ${this.selectedTimeSlots()[0].time}`
    );
    const endTime = new Date(
      `${this.activeDay()?.toISODate()} ${
        this.selectedTimeSlots()[this.selectedTimeSlots().length - 1].time
      }`
    );
    if(this.selectedTimeSlots().length === 1){
      endTime.setTime(endTime.getTime() + THIRTY_MINUTES_IN_MS)
    }
    const emails = [];
    if (this.eventData()?.email) {
      emails.push({ email: this.eventData()!.email });
    }
    if(this.user()?.email){
      emails.push({email:this.user().email!});
    }
    const eventDetails: EventDetails = {
      eventId:this.eventData()?.id,
      summary: this.eventData()?.title || '',
      description: this.eventData()?.description || '',
      startTime: formatDateToGoogleDateTime(startTime),
      endTime: formatDateToGoogleDateTime( endTime),
      email: emails,
      id:this.eventData()!.id,
      startDate:startTime,
      endDate:endTime,
      slot: this.selectedTimeSlots().map(t=> t.time)
    };
    this.calendarService.createGoogleEvent(eventDetails);
  }
}


