import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('Token stored:', localStorage.getItem('token'));
        this.router.navigate(['/main']);
      },
      (error: any) => {
        console.error('Erreur de connexion', error);
      }
    );
  }
}
