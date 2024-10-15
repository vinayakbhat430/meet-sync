import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  constructor(private http: HttpClient) {}

  async currentUser() {
    this.http.get('/api/user').subscribe(d=>{
      console.log(d)
    });
  }
}
