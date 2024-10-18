import { Component, computed, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Info } from 'luxon';
import { timeList } from '../../../shared/time-slots.util';
import { AvailabilityModel } from '../../../interfaces';
import { ApiServiceService } from '../../../services/api-service.service';
import { ConfigService } from '../../../services/config.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.less'],
})
export class AvailabilityComponent implements OnInit , OnDestroy{
  weekDays: Signal<string[]> = signal(Info.weekdays());
  availableTimes: string[] = timeList;

  scheduleForm: FormGroup;
  // Getter for the schedules FormArray
  get schedules(): FormArray {
    return this.scheduleForm.get('schedules') as FormArray;
  }

  private readonly ngUnsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiServiceService,
    private configService: ConfigService
  ) {
    // Initialize the scheduleForm with an empty FormArray
    this.scheduleForm = this.fb.group({
      schedules: this.fb.array([]), // FormArray for schedule items
    });

    this.configService.availability.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((availability) => {
      // Clear schedules only if availability.days length differs
      if (this.schedules.length !== this.weekDays().length) {
        this.schedules.clear();
        this.weekDays().forEach((d) => {
          this.schedules.push(this.createSchedule({ available: false, startTime: '', endTime: '', day: d }));
        });
      }
    
      // Iterate over weekdays and update FormArray based on availability.days
      this.schedules.controls.forEach((control, index) => {
        const weekDay = this.weekDays()[index]; // Get current weekday
        const dayObject = availability.days.find((day) => day.day === weekDay);
    
        if (dayObject) {
          control.patchValue({ available: true, ...dayObject });
        } else {
          control.patchValue({ available: false, startTime: '', endTime: '', day: weekDay });
        }
      });
    });
    
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  ngOnInit(): void {
    this.addConditionalValidation();
  }

  // Create a new FormGroup for a single schedule
  createSchedule(data: AvailabilityModel): FormGroup {
    return this.fb.group({
      available: [data.available],
      startTime: [data.startTime],
      endTime: [data.endTime ], // end time dropdown
      day: [{ value: data.day, disabled: true }], // weekday name, disabled
    });
  }

  saveAvailability() {
    const availiabilityArray = this.scheduleForm.getRawValue()
      .schedules as AvailabilityModel[];
    const daysAvailable = availiabilityArray
      .filter((d) => d.available)
      .map((d) => ({ day: d.day, startTime: d.startTime, endTime: d.endTime }));
    const postAvailability = this.apiService
      .postAvailability(daysAvailable)
      .subscribe((d) => {
        this.configService.setAvailability(d)
      });
  }

  // Add value change listeners to manage conditional validation
  addConditionalValidation() {
    this.schedules.controls.forEach((control: AbstractControl) => {
      const group = control as FormGroup;
      const availableControl = group.get('available');
      const startTimeControl = group.get('startTime');
      const endTimeControl = group.get('endTime');

      availableControl?.valueChanges.subscribe((available: boolean) => {
        if (available) {
          startTimeControl?.setValidators(Validators.required);
          endTimeControl?.setValidators(Validators.required);
        } else {
          startTimeControl?.clearValidators();
          endTimeControl?.clearValidators();
        }

        startTimeControl?.updateValueAndValidity();
        endTimeControl?.updateValueAndValidity();
      });
    });
  }
}
