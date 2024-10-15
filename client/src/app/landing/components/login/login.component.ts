import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.less',
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.initializeGoogleAuth();
    this.authService.renderGoogleButton('buttonDiv');
  }
}
