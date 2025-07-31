import { Routes } from '@angular/router';
import { TaskForm } from './component/task-form/task-form';
import { DashboardComponent } from './component/dashboard/dashboard';
import { HeaderComponent } from './component/header/header';


export const routes: Routes = [
    {
        path: 'task-form',
        component: TaskForm
      },
{
    path: '',
    component: DashboardComponent
},
{
    path: 'header',
    component: HeaderComponent
}

];
