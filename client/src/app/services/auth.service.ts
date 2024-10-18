import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiServiceService } from './api-service.service';


declare var google: any;
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router = inject(Router);
  apiService = inject(ApiServiceService)
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  // Observable for other components to subscribe to
  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();  // Expose the logged-in status as an observable
  }

  // Initialize Google OAuth
  initializeGoogleAuth(): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: '1066819936026-joc8gl1liv8n348g92i782cv9dphp87c.apps.googleusercontent.com',
        callback: this.signIn.bind(this),
        ux_mode: 'popup',
      });
    }
  }

  // Render Google sign-in button
  renderGoogleButton(elementId: string): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.renderButton(
        document.getElementById(elementId),
        { type:'standard',theme: 'filled_blue', size: 'large', shape: 'pill', with:350 }
      );
    }
  }

  private decodeToken(token:string):string{
    return JSON.parse(atob(token.split(".")[1]));
  }


  signIn(response: any):void{
    const credential = response.credential; // This is the ID token
    const decodedToken = this.decodeToken(credential);
    sessionStorage.setItem("auth",JSON.stringify(decodedToken));
    sessionStorage.setItem("authToken", credential);
    this.loggedIn.next(true);
    this.apiService.currentUser();
    this.router.navigate(["/dashboard"]);

  }


  signout():void{
    google.accounts.id.disableAutoSelect();
    sessionStorage.removeItem("auth");
    this.router.navigate(["/"]);
  }

  hasToken():boolean{
    return !!sessionStorage.getItem("auth")
  }

  getToken():string|null{
    return sessionStorage.getItem("authToken")
  }
}