import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router'; 
import { SessionService } from '../../../services/session';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [ReactiveFormsModule, FormsModule],
  standalone: true,
})
export class LoginComponent {
  loginForm: FormGroup;

  username = '';
  password = '';


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router, 
    private sessionServices: SessionService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: res => {
          alert('✅ Login successful');
          this.router.navigate(['/dashboard']);
          this.sessionServices.setToken(res.token); // ✅ Redirect after login
        },
        error: err => alert('❌ ' + err.error)
      });
    }
  }

  login() {
    // Example check (replace with real backend call)
    if (this.username === 'admin' && this.password === '123') {
      this.sessionServices.setUsername(this.username);
      this.sessionServices.setToken('fake-jwt-token');
      this.router.navigate(['/dashboard']);
    } else {
      alert('Invalid login');
    }
  }
}
