import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loading = false;
  error = '';
  form;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router){
    this.form = this.fb.group({
      userNameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

   onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const { userNameOrEmail, password } = this.form.value;
    this.auth.login(userNameOrEmail ?? '', password ?? '').subscribe({
      next: (resp) => {
        this.auth.saveToken(resp);
        this.router.navigateByUrl('');
      },
      error: (e) => {
        this.error = e?.error ?? 'Error de autenticación';
        this.loading = false;
      }
    });
  }
}
