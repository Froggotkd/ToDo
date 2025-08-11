import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule, 
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  user: string | null = null;

  constructor(private router: Router, private authService: AuthService) {
    this.updateUser();
  }

  private updateUser(): void {
    this.user = localStorage.getItem('userName');
  }

  handleAuthAction(): void {
    if (this.user) {
      this.authService.logout();
      this.user = null; 
    }
    this.router.navigate(['/login']);
  }
}
