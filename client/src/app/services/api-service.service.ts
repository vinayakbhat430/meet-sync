import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Availability, AvailabilityModel, AvailabilityPostInterface } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  constructor(private http: HttpClient) {}

  currentUser() {
    this.http.get('/api/user').subscribe();
  }

  getAvailability(){
    return this.http.get<Availability>('/api/availability');
  }

  postAvailability(data: AvailabilityPostInterface[]){
    return this.http.post<Availability>('/api/availability',data)
  }
}
