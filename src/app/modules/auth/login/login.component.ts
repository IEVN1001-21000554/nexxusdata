import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styles: [],
})
export default class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('usuario', JSON.stringify(response.user));
          console.log('Login exitoso:', response.message);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error en login:', err);
          if (err.status === 401) {
            Swal.fire('Error', 'Correo o contraseña incorrectos.', 'error');
          } else {
            Swal.fire('Error', 'Hubo un problema al iniciar sesion, vuelve a intentarlo.', 'error');
          }
        },
      });
    }
  }
}

