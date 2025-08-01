import { Routes } from '@angular/router';
import { TaskFormComponent } from './component/task-form/task-form';
import { DashboardComponent } from './component/dashboard/dashboard';
import { HeaderComponent } from './component/header/header';
import { CalendarComponent } from './component/calendar/calendar';
import { LoginComponent } from './component/Auth/login/login';
import { RegisterComponent } from './component/Auth/register/register';



export const routes: Routes = [
    {
        path: 'task-form',
        component: TaskFormComponent
      },
{
    path: 'dashboard',
    component: DashboardComponent
},
{
    path: 'header',
    component: HeaderComponent
},
{
    path: 'calendar',
    component: CalendarComponent
},
{
    path: 'Auth/login',
    component: LoginComponent
},
{
    path: 'Auth/register',
    component: RegisterComponent
},
{ path: '', redirectTo: 'Auth/login', pathMatch: 'full' },
];
