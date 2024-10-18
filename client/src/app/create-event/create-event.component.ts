import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CalendarComponent } from "../shared/components/calendar/calendar.component";
import { DateTime, Info } from 'luxon';
import { AvailabilityPostInterface } from '../interfaces';
import { ConfigService } from '../services/config.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule,SharedModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.less'
})
export class CreateEventComponent implements OnInit, OnDestroy {

  configService= inject(ConfigService)
  
  activeDay: WritableSignal<DateTime | null> = signal(null)

  availability: WritableSignal<string[]>= signal([]);

  availableTimeForSelectedDay = {
    startTime: '9:30 AM',
    endTime: '6:00 PM',
  }
  
  private readonly ngUnsubscribe$ = new Subject<void>()

  ngOnInit(): void {
    this.configService.availability.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(d=>{
      if(d){
        const weekDays = Info.weekdays().map(weekDay=>{
          const foundDay =  d.days.find(day=> day.day === weekDay)
          if(foundDay){
            return undefined
          }
          else{
            return weekDay
          }
        }).filter(day=> !!day) as string[]
        console.log(weekDays)
        this.availability.set(weekDays)
      }
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  selectedDay(day:DateTime){
    this.activeDay.set(day)
  }

}
