import { Routes } from '@angular/router';
import { TaskFormComponent } from './component/task-form/task-form';
import { DashboardComponent } from './component/dashboard/dashboard';
import { HeaderComponent } from './component/header/header';
import { CalendarComponent } from './component/calendar/calendar';
import { LoginComponent } from './component/Auth/login/login';
import { RegisterComponent } from './component/Auth/register/register';
import { authGuard } from './auth-guard';



export const routes: Routes = [
    {
        path: 'task-form',
        component: TaskFormComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
      }
      
    ,
    {
        path: 'header',
        component: HeaderComponent
    },
    {
        path: 'calendar',
        component: CalendarComponent
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./component/Auth/login/login').then(m => m.LoginComponent)
    }
    ,
    {
        path: 'Auth/register',
        component: RegisterComponent
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }


];
