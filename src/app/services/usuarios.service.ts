import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, retry, map } from 'rxjs/operators';
import { Usuario } from '../interfaces/Usuario';

@Injectable({
    providedIn: 'root'
})
export class UsuariosService {
    private apiUrl = 'http://127.0.0.1:5000/api/usuarios';

    constructor(private http: HttpClient) { }

    obtenerUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.apiUrl, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Respuesta completa:', response)),
            map(response => response.body as Usuario[]),
            catchError(this.handleError)
        );
    }

    obtenerUsuario(id: number): Observable<Usuario> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Usuario>(url, {
            headers: this.getHeaders(),
            withCredentials: true
        }).pipe(
            retry(3),
            tap(response => console.log('Respuesta completa:', response)),
            catchError(this.handleError)
        );
    }

    nuevoUsuario(nuevoUsuario: Omit<Usuario, 'id'>): Observable<Usuario> {
        return this.http.post<Usuario>(this.apiUrl, nuevoUsuario, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Usuario creado:', response)),
            map(response => response.body as Usuario),
            catchError(this.handleError)
        );
    }

    actualizarUsuario(id: number, usuarioActualizado: Partial<Usuario>): Observable<Usuario> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<Usuario>(url, usuarioActualizado, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Usuario actualizado:', response)),
            map(response => response.body as Usuario),
            catchError(this.handleError)
        );
    }

    eliminarUsuario(id: number): Observable<any> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete(url, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Usuario eliminado:', response)),
            map(response => response.body),
            catchError(this.handleError)
        );
    }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
        return headers;
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        console.error('Error completo:', error);

        if (error.error instanceof ErrorEvent) {
            console.error('Error de cliente:', error.error.message);
        } else {
            console.error(`Código de estado del backend: ${error.status}`);
            console.error(`Cuerpo del error:`, error.error);
        }

        return throwError(() => new Error('Ocurrió un error; por favor, intenta de nuevo más tarde.'));
    }
}
