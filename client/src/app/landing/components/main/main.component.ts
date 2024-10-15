import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.less'
})
export class MainComponent {
  authService = inject(AuthService);
  isLoggedIn: Observable<boolean> = this.authService.isLoggedIn
}
