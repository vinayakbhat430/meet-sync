import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from './auth.service';  // Assuming you have an AuthService to get the token
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the AuthService
    const authToken = this.authService.getToken();

    //If no token then make req (Case of google login)
    if(!authToken){
      return next.handle(req)
    }

    // Clone the request and add the new authorization header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`  // Adds the token as a Bearer token
      }
    });

    // Pass on the cloned request instead of the original request
    return next.handle(authReq);
  }
}
