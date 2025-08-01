import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';

@Component({
  standalone: true,
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm implements OnInit {
  @Output() taskCreated = new EventEmitter<void>();
  taskForm: FormGroup;

  private router = inject(Router);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['Medium', Validators.required]
    });
  }

  ngOnInit(): void {
    // Optional: load task for edit if needed
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;

      this.http.post('http://localhost:5157/api/TodoTasks', taskData).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Failed to add task:', err);
        }
      });
    }
  }
}
