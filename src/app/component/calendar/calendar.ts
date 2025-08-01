import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';

interface TodoTask {
  id: number;
  title: string;
  dueDate: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class CalendarComponent implements OnInit {
  private http = inject(HttpClient);
  tasksByDate: Record<string, TodoTask[]> = {};

  currentDate = new Date();
  selectedDate: string = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  weeks: Date[][] = [];

  ngOnInit() {
    this.generateCalendar(this.currentDate);
    this.fetchTasks();
  }

  fetchTasks() {
    this.http.get<TodoTask[]>('http://localhost:5157/api/TodoTasks').subscribe(data => {
      this.tasksByDate = {};

      for (const task of data) {
        const dateKey = task.dueDate?.split('T')[0];
        if (dateKey) {
          if (!this.tasksByDate[dateKey]) this.tasksByDate[dateKey] = [];
          this.tasksByDate[dateKey].push(task);
        }
      }
    });
  }

  generateCalendar(date: Date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    // Fill initial empty days
    for (let i = 0; i < startDay; i++) {
      currentWeek.push(null as unknown as Date);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(new Date(date.getFullYear(), date.getMonth(), day));

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null as unknown as Date);
      }
      weeks.push(currentWeek);
    }

    this.weeks = weeks;
  }

  goToPreviousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
    this.generateCalendar(this.currentDate);
  }

  goToNextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
    this.generateCalendar(this.currentDate);
  }

  selectDate(date: Date) {
    this.selectedDate = formatDate(date, 'yyyy-MM-dd', 'en');
  }

  getTasksForSelectedDate(): TodoTask[] {
    return this.tasksByDate[this.selectedDate] || [];
  }

  hasTasks(date: Date): boolean {
    const key = formatDate(date, 'yyyy-MM-dd', 'en');
    return this.tasksByDate[key]?.length > 0;
  }

  isSelected(date: Date): boolean {
    return formatDate(date, 'yyyy-MM-dd', 'en') === this.selectedDate;
  }

  isToday(date: Date): boolean {
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    return formatDate(date, 'yyyy-MM-dd', 'en') === today;
  }
}
