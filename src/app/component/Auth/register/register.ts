import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router'; // ✅ Import Router

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [ReactiveFormsModule, FormsModule],
  standalone: true
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router // ✅ Inject Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: res => {
          alert('✅ Registered successfully');
          this.router.navigate(['/login']); 
        },
        error: err => alert('❌ ' + err.error)
      });
    }
  }
}
