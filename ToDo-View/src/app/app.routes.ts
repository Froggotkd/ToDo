import { Routes } from '@angular/router';
import { ViewTasksComponent } from './tasks/view-tasks/view-tasks.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
    {path: '',canActivate:[authGuard], loadComponent: () => import('./tasks/view-tasks/view-tasks.component').then(m => m.ViewTasksComponent)  },
    {path: 'login', component: LoginComponent}
];
