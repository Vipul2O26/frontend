import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule , RouterLink],
  templateUrl: './employee-list.html',
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  selectedEmployee: any = null;

  constructor(private employeeService: EmployeeService) {}



  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  viewEmployee(emp: any) {
    this.selectedEmployee = emp;
  }

  editEmployee(emp: any) {
    alert(`Editing employee: ${emp.firstName} (Not implemented yet)`);
    // Navigate to edit route or open form (optional)
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      alert(`Deleting employee ID ${id} (Not implemented yet)`);
      // Call delete API here
    }
  }


}