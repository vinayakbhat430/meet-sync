import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Availability } from '../interfaces';
import { ApiServiceService } from './api-service.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingConfigService {

  private _availabilityTemplate: Availability = {
    email: '',
    id: '',
    days: [],
  };
  private _availability = new BehaviorSubject<Availability>(
    this._availabilityTemplate
  );
  get availability(): Observable<Availability> {
    return this._availability.asObservable();
  }
  setAvailability(updatedAvailability: Availability): void {
    this._availability.next(updatedAvailability);
  }

  constructor(private apiService: ApiServiceService) { }

  fetchAvailabilityByEmail(email?: string): void {
    this.apiService.getAvailability(email).subscribe((avblty) => {
      if (avblty) {
        this._availability.next(avblty);
      }
    });
  }
}
