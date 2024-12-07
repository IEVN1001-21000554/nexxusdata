import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, retry, map } from 'rxjs/operators';
import { Cliente } from '../interfaces/Cliente';

@Injectable({
    providedIn: 'root'
})
export class ClientesService {
    private apiUrl = 'http://127.0.0.1:5000/api/clientes';

    constructor(private http: HttpClient) { }

    obtenerClientes(): Observable<Cliente[]> {
        return this.http.get<Cliente[]>(this.apiUrl, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Respuesta completa:', response)),
            map(response => response.body as Cliente[]),
            catchError(this.handleError)
        );
    }

    obtenerCliente(id: number): Observable<Cliente> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Cliente>(url, {
            headers: this.getHeaders(),
            withCredentials: true
        }).pipe(
            retry(3),
            tap(response => console.log('Respuesta completa:', response)),
            catchError(this.handleError)
        );
    }

    nuevoCliente(nuevoCliente: Omit<Cliente, 'id'>): Observable<Cliente> {
        return this.http.post<Cliente>(this.apiUrl, nuevoCliente, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Cliente creado:', response)),
            map(response => response.body as Cliente),
            catchError(this.handleError)
        );
    }

    actualizarCliente(id: number, clienteActualizado: Partial<Cliente>): Observable<Cliente> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<Cliente>(url, clienteActualizado, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Cliente actualizado:', response)),
            map(response => response.body as Cliente),
            catchError(this.handleError)
        );
    }

    eliminarCliente(id: number): Observable<any> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete(url, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Cliente eliminado:', response)),
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

