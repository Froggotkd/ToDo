import { Routes } from '@angular/router';
import { ViewTasksComponent } from './tasks/view-tasks/view-tasks.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {path: '', component:ViewTasksComponent},
    {path: 'login', component: LoginComponent}
];
