import { Component, OnInit, inject, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';
import { CalendarComponent } from '../calendar/calendar';

interface TodoTask {
  id: number;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  isCompleted: boolean;
  dueDate: string;
}

@Component({
  standalone: true,
  selector: 'app-task-dashboard',
  imports: [CommonModule, FormsModule, RouterModule , HeaderComponent , FooterComponent , CalendarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  tasks = signal<TodoTask[]>([]);
  allTasks: TodoTask[] = [];

  showToast = false;
  toastMessage = '';
  showModal = false;
  taskToDelete: number | null = null;
  chartInstance: any;

  isDarkMode = false;
  selectedDate = '';

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isDarkMode = localStorage.getItem('theme') === 'dark';
    }
    this.fetchTasks();
  }

  fetchTasks() {
    this.http.get<TodoTask[]>('http://localhost:5157/api/TodoTasks').subscribe(data => {
      this.allTasks = data;
      this.tasks.set(data);
      this.renderChart(data);
    });
  }

  loadTasks() {
    this.fetchTasks();
  }

  renderChart(tasks: TodoTask[]) {
    const counts = { High: 0, Medium: 0, Low: 0 };
    tasks.forEach(task => counts[task.priority]++);

    const ctx = document.getElementById('taskChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chartInstance) this.chartInstance.destroy();

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['High', 'Medium', 'Low'],
        datasets: [{
          data: [counts.High, counts.Medium, counts.Low],
          backgroundColor: ['#dc2626', '#facc15', '#16a34a']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  deleteTask(taskId: number) {
    this.taskToDelete = taskId;
    this.showModal = true;
  }

  cancelDelete() {
    this.taskToDelete = null;
    this.showModal = false;
  }

  deleteConfirmed() {
    if (this.taskToDelete !== null) {
      this.http.delete(`http://localhost:5157/api/TodoTasks/${this.taskToDelete}`).subscribe({
        next: () => {
          const updatedTasks = this.tasks().filter(task => task.id !== this.taskToDelete);
          this.tasks.set(updatedTasks);
          this.toastMessage = '🗑️ Task deleted successfully!';
          this.showToast = true;
          setTimeout(() => this.showToast = false, 3000);
          this.showModal = false;
          this.taskToDelete = null;
          this.renderChart(updatedTasks);
        },
        error: () => {
          this.toastMessage = '❌ Failed to delete task!';
          this.showToast = true;
          setTimeout(() => this.showToast = false, 3000);
          this.showModal = false;
          this.taskToDelete = null;
        }
      });
    }
  }

  markAsComplete(id: number): void {
    const task = this.tasks().find(t => t.id === id);
    if (!task) return;

    const updatedTask: TodoTask = { ...task, isCompleted: true };

    this.http.put(`http://localhost:5157/api/TodoTasks/${id}`, updatedTask).subscribe({
      next: () => {
        this.toastMessage = '✅ Task marked as completed!';
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);
        this.loadTasks(); 
      },
      error: err => {
        console.error('Failed to mark as complete', err);
        this.toastMessage = '❌ Failed to update task!';
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);
      }
    });
  }

  
}
