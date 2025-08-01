import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Inject, PLATFORM_ID } from '@angular/core';
import Chart from 'chart.js/auto';


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
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private http = inject(HttpClient);

  tasks = signal<TodoTask[]>([]);
  allTasks: TodoTask[] = [];

  showToast = false;
  toastMessage = '';
  showModal = false;
  taskToDelete: number | null = null;
  chartInstance: any;

  isDarkMode = false;
  selectedDate = '';

  // Calendar Data
  calendarMonths: { monthName: string; days: number[]; month: number; year: number }[] = [];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isDarkMode = localStorage.getItem('theme') === 'dark';
    }

    
    this.fetchTasks();
  }

  // Fetch tasks from backend
  fetchTasks() {
    this.http.get<TodoTask[]>('http://localhost:5157/api/TodoTasks').subscribe(data => {
      this.allTasks = data;
      this.tasks.set(data);
      this.renderChart(data);
    });
  }


  // Chart render logic
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
            position: 'bottom',
            labels: {
              color: this.isDarkMode ? '#fff' : '#000'
            }
          }
        }
      }
    });
  }

  // Delete logic
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
          this.toastMessage = 'Task deleted successfully!';
          this.showToast = true;
          setTimeout(() => this.showToast = false, 3000);
          this.showModal = false;
          this.taskToDelete = null;
          this.renderChart(updatedTasks);
        },
        error: () => {
          this.toastMessage = 'Failed to delete task!';
          this.showToast = true;
          setTimeout(() => this.showToast = false, 3000);
          this.showModal = false;
          this.taskToDelete = null;
        }
      });
    }
  }
}
