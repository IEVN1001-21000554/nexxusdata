// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './modules/auth/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'nexxusdata';
  acceso: boolean = false;

  constructor(private loginService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.acceso = this.loginService.isLogged() && !this.isLoginPage();
      }
    });
  }

  private isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
