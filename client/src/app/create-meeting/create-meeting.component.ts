import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { DateTime, Info } from 'luxon';
import { Subject, takeUntil } from 'rxjs';
import { AvailabilityPostInterface, TimeSlots } from '../interfaces';
import { ApiServiceService } from '../services/api-service.service';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-create-meeting',
  standalone: true,
  imports: [],
  templateUrl: './create-meeting.component.html',
  styleUrl: './create-meeting.component.less',
})
export class CreateMeetingComponent implements OnInit {
  configService = inject(ConfigService);

  apiService = inject(ApiServiceService);

  activeDay: WritableSignal<DateTime | null> = signal(null);

  availability: WritableSignal<string[]> = signal([]);
  availableSlots: WritableSignal<AvailabilityPostInterface[]> = signal([]);

  availableTimeForSelectedDay = {
    startTime: '9:30 AM',
    endTime: '6:00 PM',
  };

  showNext: WritableSignal<boolean> = signal(false);
  selectedTimeSlots: WritableSignal<TimeSlots[]> = signal([]);

  private readonly ngUnsubscribe$ = new Subject<void>();

  ngOnInit(): void {
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
