import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Availability, User } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _userTemplate: User = {
    email: '',
    id: '',
    picture: '',
  };
  private _user = new BehaviorSubject<User>(this._userTemplate);
  get user(): Observable<User> {
    return this._user.asObservable();
  }

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

  constructor(private apiService: ApiServiceService) {
    this.apiService.currentUser().subscribe((d) => {
      if(d){
        this._user.next(d.user);
        this.fetchAvailability();
      }
    });

    
  }

  fetchAvailability(){
    this.apiService.getAvailability().subscribe((avblty) => {
      if(avblty){
        this._availability.next(avblty);
      }
    });
  }
}
