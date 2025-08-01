import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router'; // ✅ Import Router

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [ReactiveFormsModule, FormsModule],
  standalone: true,
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router // ✅ Inject Router
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
          this.router.navigate(['/dashboard']); // ✅ Redirect after login
        },
        error: err => alert('❌ ' + err.error)
      });
    }
  }
}
