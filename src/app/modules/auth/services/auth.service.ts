import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../../interfaces/LoginResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000/api/auth'; // URL base del backend
  private isLoggedIn = false;

  constructor(private http: HttpClient) { }

  // Registro de usuario
  register(datos: { nombre_usuario: string; correo: string; contraseña: string; rol: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, datos);
  }

  // Inicio de sesión
  login(datos: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, datos);
  }

  logout(): void {
    this.isLoggedIn = false;
  }

  isLogged(): boolean {
    return this.isLoggedIn;
  }
}

