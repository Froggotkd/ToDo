import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="login">
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <h2>Iniciar sesión</h2>
      <input placeholder="Usuario o Email" formControlName="userNameOrEmail">
      <input placeholder="Contraseña" type="password" formControlName="password">
      <button type="submit" [disabled]="form.invalid || loading">Entrar</button>
      <div class="error" *ngIf="error">{{error}}</div>
    </form>
  </div>
  `,
  styles: [`.login{max-width:360px;margin:40px auto;display:block}`]
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

  onSubmit(){
    if(this.form.invalid) return;
    this.loading = true;
    const { userNameOrEmail, password } = this.form.value;
    this.auth.login(userNameOrEmail!, password!).subscribe({
      next: (resp) => { this.auth.saveToken(resp); this.router.navigateByUrl(''); },
      error: (e) => { this.error = e?.error ?? 'Error de autenticación'; this.loading = false; }
    });
  }
}
