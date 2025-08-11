import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  expiresAt: string;
  userName: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'https://localhost:7243/api'; 

  constructor(private http: HttpClient, private router: Router) {}

  login(userNameOrEmail: string, password: string) {
    
    return this.http.post<AuthResponse>(`${this.api}/Auth/login`, { userNameOrEmail, password });
  }

  saveToken(resp: AuthResponse) {
    localStorage.setItem('token', resp.token);
    localStorage.setItem('expiresAt', resp.expiresAt);
    localStorage.setItem('userName', resp.userName);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    localStorage.setItem('userName', '');
    this.router.navigateByUrl('/login');
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  isTokenExpired(): boolean {
    const exp = localStorage.getItem('expiresAt');
    if (!exp) return true;
    return new Date(exp) <= new Date(); 
  }

  isLoggedIn(): boolean {
    const t = this.token;
    return !!t && !this.isTokenExpired();
  }
}
