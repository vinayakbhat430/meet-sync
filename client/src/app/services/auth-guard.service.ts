import { inject, Injectable } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { AuthService } from './auth.service';
import { CanActivate, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  authService = inject(AuthService);
  router = inject(Router);
  messageService = inject(NzMessageService);

  canActivate(): boolean | Observable<boolean> {
    return this.authService.isLoggedIn.pipe(
      take(1),
      map((data) => {
        if (data) {
          return true; // User is logged in
        } else {
          this.messageService.error('Please login to continue');
          this.router.navigate(['/']); // Redirect to login page if not logged in
          return false; // Block access
        }
      })
    );
  }
}
