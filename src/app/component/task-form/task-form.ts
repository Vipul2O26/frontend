import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';


@Component({
  standalone: true,
  selector: 'app-task-form',
  imports: [CommonModule, ReactiveFormsModule , HeaderComponent , FooterComponent],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);


  @ViewChild('formRef') formRef!: ElementRef;

ngAfterViewInit() {
  if (this.formRef?.nativeElement) {
    setTimeout(() => {
      this.formRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this.formRef.nativeElement.querySelector('input')?.focus();
    }, 300);
  }
}

  toastMessage = '';
  showToast = false;

  showSuccessToast(msg: string) {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

  taskForm!: FormGroup;
  taskId: number | null = null;
  isEditMode = false;

  ngOnInit(): void {
    // Initialize form
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      dueDate: ['', [Validators.required]],
      priority: ['Medium']
    });
    

    // Get ID from query params
    this.route.queryParams.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.taskId = id;
        this.isEditMode = true;
        this.loadTask(id);
      }
    });
  }

  loadTask(id: number) {
    this.http.get<any>(`http://localhost:5157/api/TodoTasks/${id}`).subscribe({
      next: (task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate?.slice(0, 16),
          priority: task.priority
        });
  
        // ✅ Store the userId for later
        this.taskForm.patchValue({ userId: task.userId });
      },
      error: (err) => {
        console.error('Error loading task:', err);
      }
    });
  }
  
  onSubmit() {
    if (this.taskForm.invalid) return;
  
    const taskData = {
      ...this.taskForm.value,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      userId: 1 // 🔑 Always include this
    };
  
    if (this.isEditMode && this.taskId !== null) {
      this.http.put(`http://localhost:5157/api/TodoTasks/${this.taskId}`, {
        id: this.taskId,
        ...taskData
      }).subscribe({
        next: () => {
          this.showSuccessToast('✅ Task updated successfully!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error("❌ Task update failed:", error);
          alert(JSON.stringify(error.error?.errors, null, 2));
        }
      });
    } else {
      this.http.post(`http://localhost:5157/api/TodoTasks`, taskData).subscribe({
        next: () => {
          this.showSuccessToast('✅ Task added successfully!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error("❌ Task creation failed:", error);
          alert(JSON.stringify(error.error?.errors, null, 2));
        }
      });
    }
  }
  
  
  getErrorMessage(err: any): string {
    if (err.error?.errors) {
      const messages = Object.entries(err.error.errors)
        .map(([field, errs]) => `${field}: ${(errs as string[]).join(', ')}`);
      return messages.join('\n');
    }
    return err.message || 'Unknown error occurred.';
  }
  
  
}
