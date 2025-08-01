import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';


@Component({
  standalone: true,
  selector: 'app-task-form',
  imports: [CommonModule, ReactiveFormsModule],
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
          dueDate: task.dueDate?.slice(0, 16), // trim to 'yyyy-MM-ddTHH:mm'
          priority: task.priority
        });
      },
      error: (err) => {
        console.error('Error loading task:', err);
      }
    });
  }

  onSubmit() {
    if (this.taskForm.invalid) return;
  
    const taskData = this.taskForm.value;
  
    if (this.isEditMode && this.taskId !== null) {
      this.http.put(`http://localhost:5157/api/TodoTasks/${this.taskId}`, {
        id: this.taskId,
        ...taskData
      }).subscribe(() => {
        this.showSuccessToast('✅ Task updated successfully!');
        this.router.navigate(['/']);
      });
    } else {
      this.http.post(`http://localhost:5157/api/TodoTasks`, taskData).subscribe(() => {
        this.showSuccessToast('✅ Task added successfully!');
        this.router.navigate(['/']);
      });
    }
  }
  
}
