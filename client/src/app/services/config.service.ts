import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Availability, EventDetails, EventsResponse, User } from '../interfaces';

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
  setUser(user: User){
    this._user.next(user);
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

  private _events= new BehaviorSubject<EventsResponse[]>([]);
  get eventDetails():Observable<EventsResponse[]>{
    return this._events.asObservable()
  }
  setEventDetails(eventDetails:EventsResponse[]){
    this._events.next(eventDetails);
  }

  constructor(private apiService: ApiServiceService) {
    this.fetchUser();
  }

  fetchUser(){
    const fetchedUser  = this.apiService.currentUser().subscribe((d) => {
      if(d){
        this._user.next(d.user);
        this.fetchAvailability();
      }
      fetchedUser.unsubscribe();
    });
  }

  fetchAvailability(){
    this.apiService.getAvailability().subscribe((avblty) => {
      if(avblty){
        this._availability.next(avblty);
      }
    });
  }

  refreshEventDetails(){
    this.apiService.getEvents().subscribe(events =>{
      if(events){
        this._events.next(events);
      }
    })
  }
}
