import {
  Component,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { DateTime, Info } from 'luxon';
import {  Subject,  takeUntil } from 'rxjs';
import { AvailabilityPostInterface, EventDetails, EventsResponse, TimeSlots, User } from '../interfaces';
import { ApiServiceService } from '../services/api-service.service';
import { SharedModule } from "../shared/shared.module";
import { ActivatedRoute } from '@angular/router';
import { MeetingConfigService } from '../services/meeting-config.service';
import { CalendarService } from '../services/calendar.service';
import { ConfigService } from '../services/config.service';
import { convertTo24Hour, formatDateToGoogleDateTime } from '../shared/time-slots.util';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


const THIRTY_MINUTES_IN_MS = 30 * 60 * 1000


@Component({
  selector: 'app-create-meeting',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule,FormsModule],
  templateUrl: './create-meeting.component.html',
  styleUrl: './create-meeting.component.less',
})
export class CreateMeetingComponent implements OnInit {
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

  maxSlots: Signal<number> = signal(100);

  private readonly ngUnsubscribe$ = new Subject<void>();
  eventId: any;
  emailId: any;

  meetingform:FormGroup;
  constructor(private fb:FormBuilder){
    this.meetingform = this.fb.group({
      title:['', Validators.required],
      description:['', Validators.required]
    })
  }

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
        this.emailId = params['emailId'];

        // Use emailId to fetch availability if available
        this.configService.fetchAvailabilityByEmail(this.emailId);
      });
  }


  selectedDay(day: DateTime) {
    this.activeDay.set(day);
    this.configService.getCurrentDayBookedSlots(this.emailId,this.activeDay()!.toJSDate().toISOString()||'')

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

  /**
   * here dates are in UTC format, we need to convert them to ISO date or date as per local timezone.
   * else wrong timezone will be shown
   */
  joinEvent() {
    const formData = this.meetingform.getRawValue() as MeetingModal;

    const startTime = new Date(
      `${this.activeDay()?.toJSDate().toDateString()} ${convertTo24Hour(this.selectedTimeSlots()[0].time)}`
    );
    const endTime = new Date(
      `${this.activeDay()?.toJSDate().toDateString()} ${
        convertTo24Hour(this.selectedTimeSlots()[this.selectedTimeSlots().length - 1].time)
      }`
    );

    endTime.setTime(endTime.getTime() + THIRTY_MINUTES_IN_MS)
    const emails = [];
    emails.push({ email: this.emailId });
    if(this.user()?.email){
      emails.push({email:this.user().email!});
    }    const eventDetails: EventDetails = {
      summary: formData.title,
      description: formData.description,
      startTime: formatDateToGoogleDateTime(startTime),
      endTime: formatDateToGoogleDateTime( endTime),
      email: emails,
      startDate:startTime,
      endDate:endTime,
      slot: this.selectedTimeSlots().map(t=> t.time)
    };
    this.calendarService.createGoogleEvent(eventDetails).then(e=>{
      if(window.confirm("Please refresh to continue")){
        window.location.reload()
      }
    }).catch(e=>{

    });
  }
}

interface MeetingModal {
  title:string;
  description:string;
}