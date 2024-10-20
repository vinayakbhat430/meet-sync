import { HttpClient, HttpParams } from '@angular/common/http';
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

  getAvailability(email?:string){
    let params = new HttpParams()
    if(email){
      params = params.set('email', email)
    }
    return this.http.get<Availability>('/api/availability', {params});
  }

  postAvailability(data: AvailabilityPostInterface[]){
    return this.http.post<Availability>('/api/availability',data)
  }

  getEvents(){
    return this.http.get<EventsResponse[]>('/api/events');
  }

  getEventsById(eventId:string){
    return this.http.get<EventsResponse>(`/api/event/${eventId}`);
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

  getBookedSlots(email:string,date:string){
    return this.http.get<string[]>(`/api/booked-slots/${email}/${date}`);
  }
}
