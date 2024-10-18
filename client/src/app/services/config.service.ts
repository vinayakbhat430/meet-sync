import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Availability } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _availabilityTemplate: Availability = {
    email: '',
    id: '',
    days: []
  }
  private _availability = new BehaviorSubject<Availability>(this._availabilityTemplate);
  get availability():Observable<Availability>{
    return this._availability.asObservable()
  }
  setAvailability(updatedAvailability: Availability): void {
    this._availability.next(updatedAvailability);
  }

  constructor(private apiService: ApiServiceService) {
     this.apiService.getAvailability().subscribe(avblty =>{
      this._availability.next(avblty);
    })
  }
}
