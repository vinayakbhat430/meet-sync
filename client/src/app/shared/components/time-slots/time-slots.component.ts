import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnChanges,
  output,
  signal,
  Signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { timeList } from '../../time-slots.util';
import { TimeSlots } from '../../../interfaces';
import { max } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.less'],
})
export class TimeSlotsComponent implements OnChanges {
  // Signal representing time slots with default values
  bookedSlots = input<string[]>();
  maxSlots = input<number>(100);
  nextEvent = output<TimeSlots[]>();

  messageService = inject(NzMessageService);

  bookableSlots = input<{ startTime: string; endTime: string }>({
    startTime: '12:00 AM',
    endTime: '11:59 PM',
  });
  timeSlots: WritableSignal<TimeSlots[]> = signal([]);


  ngOnChanges(changes: SimpleChanges): void {
    if(JSON.stringify(changes['bookableSlots']?.currentValue) !== JSON.stringify(changes['bookableSlots']?.previousValue)){
      this.timeSlots.set(
        timeList
        .slice(
          timeList.indexOf(this.bookableSlots().startTime),
          timeList.indexOf(this.bookableSlots().endTime) + 1
        )
        .map((time) => ({
          time: time,
          isSelected: false,
          isBooked: false,
          canSelect: true,
        })))
    }
  }
  // Toggle selection of a time slot
  toggleSelection(index: number): void {
    const currentSlots = this.timeSlots();

    const selectedSlots = this.timeSlots().filter((slot) => slot.isSelected);

    // If the slot is already selected, deselect it
    if (currentSlots[index].isSelected) {
      this.updateTimeSlot(index, { isSelected: false });
    }
    // If the slot can be selected, select it
    else if (this.canSelect(index) && selectedSlots.length < this.maxSlots()) {
      this.updateTimeSlot(index, { isSelected: true });
    }

    if( selectedSlots.length >= this.maxSlots()){
      this.messageService.error(`This event can be max ${this.maxSlots()*30} minutes!`)
    }
    this.nextBtnClick();

    this.updateCanSelectStatus();
  }

  // Check if a time slot is selected
  isSelected(index: number): boolean {
    return this.timeSlots()[index].isSelected;
  }

  // Check if a time slot is booked (disabled)
  isBooked(index: number): boolean {
    return this.timeSlots()[index].isBooked;
  }

  // Update individual time slot properties
  updateTimeSlot(index: number, changes: Partial<TimeSlots>): void {
    const updatedSlots = this.timeSlots().map((slot, i) =>
      i === index ? { ...slot, ...changes } : slot
    );
    this.timeSlots.set(updatedSlots);
  }

  // Check if the time slot can be selected (ensuring continuous selection)
  canSelect(index: number): boolean {
    const selectedSlots = this.timeSlots().filter((slot) => slot.isSelected);
    if (selectedSlots.length === 0) return true;

    const selectedIndices = this.timeSlots()
      .map((slot, idx) => (slot.isSelected ? idx : -1))
      .filter((idx) => idx !== -1);

    const minSelected = Math.min(...selectedIndices);
    const maxSelected = Math.max(...selectedIndices);

    // Allow selection if it's adjacent to the current selection
    return index === minSelected - 1 || index === maxSelected + 1;
  }

  // Update 'canSelect' status for all time slots based on the selection
  updateCanSelectStatus(): void {
    const currentSlots = this.timeSlots();
    const selectedIndices = currentSlots
      .map((slot, idx) => (slot.isSelected ? idx : -1))
      .filter((idx) => idx !== -1);

    if (selectedIndices.length === 0) {
      // All slots are selectable if no slot is selected
      this.timeSlots.set(
        currentSlots.map((slot) => ({
          ...slot,
          canSelect: !slot.isBooked,
        }))
      );
    } else {
      const minSelected = Math.min(...selectedIndices);
      const maxSelected = Math.max(...selectedIndices);

      // Update canSelect based on whether it's adjacent to selected slots
      this.timeSlots.set(
        currentSlots.map((slot, idx) => ({
          ...slot,
          canSelect:
            !slot.isBooked &&
            (idx === minSelected - 1 || idx === maxSelected + 1),
        }))
      );
    }
  }

  //emit the selected slots to the parent
  nextBtnClick(){
    this.nextEvent.emit(this.timeSlots().filter(slots=> slots.isSelected))
  }
}

