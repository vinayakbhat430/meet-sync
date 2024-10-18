import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Availability, AvailabilityModel, AvailabilityPostInterface, Events, EventsResponse, Meeting, UserResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  constructor(private http: HttpClient) {}

  currentUser() {
    return this.http.get<UserResponse>('/api/user');
  }

  getAvailability(){
    return this.http.get<Availability>('/api/availability');
  }

  postAvailability(data: AvailabilityPostInterface[]){
    return this.http.post<Availability>('/api/availability',data)
  }

  getEvents(){
    return this.http.get<EventsResponse[]>('/api/events');
  }

  deleteEvent(eventId:string){
    return this.http.delete(`/api/events/${eventId}`);
  }

  postEvents(data: Events){
    return this.http.post<EventsResponse>('/api/events',data)
  }

  getMeetings(){
    return this.http.get<Meeting[]>('/api/bookings');
  }

  postMeeting(data: Meeting){
    return this.http.post<Meeting>('/api/bookings',data)
  }
}
