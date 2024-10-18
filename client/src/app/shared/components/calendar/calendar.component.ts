import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal, Signal, WritableSignal } from '@angular/core';
import { DateTime, Info, Interval } from 'luxon';
import { SharedModule } from '../../shared.module';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.less'
})
export class CalendarComponent {
  availabilityDays = input<string[]>([])
  selectedDay = output<DateTime>()
  today: Signal<DateTime> = signal(DateTime.local());
  firstDayOfActiveMonth :WritableSignal<DateTime> = signal(
    this.today().startOf('month')
  );
  activeDay: WritableSignal<DateTime | null> = signal(null)
  weekDays:Signal<string[]> = signal(Info.weekdays('short'));
  daysOfMonth: Signal<DateTime[]> = computed(()=>{
    return Interval.fromDateTimes(
      this.firstDayOfActiveMonth().startOf('week'),
      this.firstDayOfActiveMonth().endOf('month').endOf('week')
    )
    .splitBy({day:1})
    .map((d)=>{
      if(d.start === null){
        throw new Error('Date cannot be null')
      }
      return d.start
    });
  });


  goToMonth(mode:'minus'|'plus'){
    this.firstDayOfActiveMonth.set(this.firstDayOfActiveMonth()[mode]({month:1}))
  }

  goToToday():void{
    this.firstDayOfActiveMonth.set(this.today().startOf('month'))
    this.activeDay.set(this.today())
  }

  updateSelectedDay(dayOfMonth:DateTime){
    if(!this.availabilityDays().includes(dayOfMonth.weekdayLong || '')){
      this.activeDay.set(dayOfMonth)
      this.selectedDay.emit(dayOfMonth);
    }
  }
}
