import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.less'
})
export class MainComponent {
  authService = inject(AuthService);
  router = inject(Router);
  
  isLoggedIn: Observable<boolean> = this.authService.isLoggedIn

  navigateToDashboard(){
    this.router.navigate(['/dashboard'])
  }
}
