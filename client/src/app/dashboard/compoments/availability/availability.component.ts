import { Component, computed, OnInit, Signal, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Info } from 'luxon';
import { timeList } from './availiability.util';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.less'],
})
export class AvailabilityComponent implements OnInit{
  weekDays: Signal<string[]> = signal(Info.weekdays());
  availableTimes: string[] = timeList;

  scheduleForm: FormGroup;
  // Getter for the schedules FormArray
  get schedules(): FormArray {
    return this.scheduleForm.get('schedules') as FormArray;
  }

  constructor(private fb: FormBuilder) {
    // Initialize the scheduleForm with an empty FormArray
    this.scheduleForm = this.fb.group({
      schedules: this.fb.array([]), // FormArray for schedule items
    });

    // Create a schedule form group for each weekday
    this.weekDays().forEach((d) => {
      this.schedules.push(
        this.createSchedule({
          available: false,
          startTime: '',
          endTime: '',
          weekDay: d,
        })
      );
    });
  }
  ngOnInit(): void {
    this.addConditionalValidation()
  }

  // Create a new FormGroup for a single schedule
  createSchedule(data: AvailabilityModel): FormGroup {
    return this.fb.group({
      available: [data.available], 
      startTime: [data.startTime],
      endTime: [{ value: data.endTime, disabled: true }], // end time dropdown
      weekDay: [{ value: data.weekDay, disabled: true }], // weekday name, disabled
    });
  }

  saveAvailability(){
    const availiabilityArray = this.scheduleForm.getRawValue().schedules as AvailabilityModel[];
    const daysAvailable = availiabilityArray.filter(d=> d.available);
    console.log(daysAvailable);

  }

   // Add value change listeners to manage conditional validation
   addConditionalValidation() {
    this.schedules.controls.forEach((control: AbstractControl) => {
      const group = control as FormGroup
      const availableControl = group.get('available');
      const startTimeControl = group.get('startTime');
      const endTimeControl = group.get('endTime');

      availableControl?.valueChanges.subscribe((available: boolean) => {
        if (available) {
          startTimeControl?.setValidators(Validators.required);
          endTimeControl?.setValidators(Validators.required);
          endTimeControl?.enable();
        } else {
          startTimeControl?.clearValidators();
          endTimeControl?.clearValidators();
          endTimeControl?.disable();
        }

        startTimeControl?.updateValueAndValidity();
        endTimeControl?.updateValueAndValidity();
      });
    });
  }
}

// Interface for the schedule data model
interface AvailabilityModel {
  available: boolean;
  startTime: string;
  endTime: string;
  weekDay: string;
}
