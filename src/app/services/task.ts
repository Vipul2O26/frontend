import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface TodoTask{
  updateTask(task: TodoTask): unknown;
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string;
  dueDate?: string;
  priority: string;
}

@Injectable({
  providedIn: 'root'
})
export class Task {
  private apiUrl = 'http://localhost:5157/api/TodoTasks'; 

  constructor(private http: HttpClient) {}

  getTasks(): Observable<TodoTask[]> {
    return this.http.get<TodoTask[]>(this.apiUrl);
  }

  getTask(id: number): Observable<TodoTask> {
    return this.http.get<TodoTask>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Partial<TodoTask>): Observable<TodoTask> {
    return this.http.post<TodoTask>(this.apiUrl, task);
  }

  updateTask(task: TodoTask): Observable<any> {
    return this.http.put(`${this.apiUrl}/${task.id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
 
}
