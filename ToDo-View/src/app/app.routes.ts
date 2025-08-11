import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
    {path: '',canActivate:[authGuard], loadComponent: () => import('./tasks/view-tasks/view-tasks.component').then(m => m.ViewTasksComponent)  },
    {path: 'create-task',canActivate:[authGuard], loadComponent: () => import('./tasks/create-task/create-task.component').then(m => m.CreateTaskComponent) },
    {path: 'login', component: LoginComponent}
];
