import { Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';
import { EmployeeListComponent } from './components/employee-list/employee-list';
import { LoginComponent } from './Auth/login/login';
import { RegisterComponent } from './Auth/register/register';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
 
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'employee-list',
        component: EmployeeListComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    }
];
