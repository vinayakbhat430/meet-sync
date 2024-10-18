import { Component, inject, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CalendarComponent } from "../shared/components/calendar/calendar.component";
import { DateTime, Info } from 'luxon';
import { AvailabilityPostInterface, Events, TimeSlots } from '../interfaces';
import { ConfigService } from '../services/config.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiServiceService } from '../services/api-service.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, FormsModule,SharedModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.less'
})
export class CreateEventComponent implements OnInit, OnDestroy {

  configService= inject(ConfigService);

  apiService = inject(ApiServiceService);

  messageService = inject(NzMessageService);

  currentUserEmail: WritableSignal<string> = signal('')
  
  // activeDay: WritableSignal<DateTime | null> = signal(null);

  // availability: WritableSignal<string[]>= signal([]);
  // availableSlots: WritableSignal<AvailabilityPostInterface[]>= signal([])

  // availableTimeForSelectedDay = {
  //   startTime: '9:30 AM',
  //   endTime: '6:00 PM',
  // }

  slots:Signal<number[]>  =signal(Array.from({ length: 10 }, (_, i) => i + 1))

  // showNext: WritableSignal<boolean> = signal(false);
  // selectedTimeSlots: WritableSignal<TimeSlots[]> = signal([]);

  
  private readonly ngUnsubscribe$ = new Subject<void>()

  eventForm:FormGroup;
  constructor(private fb:FormBuilder){
    this.eventForm = this.fb.group({
      title:[''],
      description:[''],
      duration:[1],
      isPrivate:[false]
    })
  }

  ngOnInit(): void {
    this.configService.user.subscribe(user=>{
      this.currentUserEmail.set(user.email)
    });
    // this.configService.availability.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(d=>{
    //   if(d){
    //     this.availableSlots.set(d.days);
    //     const weekDays = Info.weekdays().map(weekDay=>{
    //       const foundDay =  d.days.find(day=> day.day === weekDay)
    //       if(foundDay){
    //         return undefined
    //       }
    //       else{
    //         return weekDay
    //       }
    //     }).filter(day=> !!day) as string[]
    //     this.availability.set(weekDays)
    //   }
    // })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  // selectedDay(day:DateTime){
  //   this.activeDay.set(day)
  //   const selectedDay =this.availableSlots().find(d=> d.day === day.weekdayLong);
  //   if(selectedDay){
  //     this.availableTimeForSelectedDay ={startTime: selectedDay.startTime, endTime: selectedDay.endTime};
  //   }
  // }

  // slotsBooked(data:TimeSlots[]){
  //   this.showNext.set(true);
  //   this.selectedTimeSlots.set(data);
  // }

  // goToPrevious(){
  //   this.showNext.set(false);
  // }

  createEvent(){
    const formData = this.eventForm.getRawValue() as EventModel
    console.log(this.currentUserEmail())
    const postPayload:Events = {...formData , duration: formData.duration * 30, bookings:[],email:this.currentUserEmail()}
    this.apiService.postEvents(postPayload).subscribe(d =>{
      this.messageService.success('Created Event Successfully');
    })

  }

}

interface EventModel {
  title:string,
  description:string,
  duration:number,
  isPrivate:boolean
}
