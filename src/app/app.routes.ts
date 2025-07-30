import { Routes } from '@angular/router';
import { TaskForm } from './component/task-form/task-form';
import { TaskItem } from './component/task-item/task-item';
import { TaskList } from './component/task-list/task-list';


export const routes: Routes = [
{
    path: 'task-form',
    component: TaskForm
},
{
    path: 'task-item',
    component: TaskItem
},
{
    path: 'task-list',
    component: TaskList
}
];
