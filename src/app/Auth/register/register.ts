import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [
    ReactiveFormsModule , CommonModule , RouterModule
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.registerForm.valid) {
      const userData = this.registerForm.value;
      this.authService.registerUser(userData).subscribe({
        next: (res) => {
          this.successMessage = 'User registered successfully!';
          this.registerForm.reset();
          this.submitted = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Registration failed.';
        }
      });
    }
  }
}
