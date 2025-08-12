import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
    {path: '',canActivate:[authGuard], loadComponent: () => import('./tasks/view-tasks/view-tasks.component').then(m => m.ViewTasksComponent)  },
    {path: 'comment/:id',canActivate:[authGuard], loadComponent: () => import('./comments/view-comments/view-comments.component').then(m => m.ViewCommentsComponent)  },
    {path: 'login', component: LoginComponent},
    {path: '**', redirectTo:''}
];
