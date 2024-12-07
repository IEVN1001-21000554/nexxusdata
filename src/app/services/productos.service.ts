import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, retry, map } from 'rxjs/operators';
import { Producto } from '../interfaces/Producto';

@Injectable({
    providedIn: 'root'
})
export class ProductosService {
    private apiUrl = 'http://127.0.0.1:5000/api/productos';

    constructor(private http: HttpClient) { }

    obtenerProductos(): Observable<Producto[]> {
        return this.http.get<Producto[]>(this.apiUrl, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Respuesta completa:', response)),
            map(response => response.body as Producto[]),
            catchError(this.handleError)
        );
    }

    obtenerProducto(id: number): Observable<Producto> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Producto>(url, {
            headers: this.getHeaders(),
            withCredentials: true
        }).pipe(
            retry(3),
            tap(response => console.log('Respuesta completa:', response)),
            catchError(this.handleError)
        );
    }

    nuevoProducto(nuevoProducto: Omit<Producto, 'id'>): Observable<Producto> {
        return this.http.post<Producto>(this.apiUrl, nuevoProducto, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Producto creado:', response)),
            map(response => response.body as Producto),
            catchError(this.handleError)
        );
    }

    actualizarProducto(id: number, productoActualizado: Partial<Producto>): Observable<Producto> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<Producto>(url, productoActualizado, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Producto actualizado:', response)),
            map(response => response.body as Producto),
            catchError(this.handleError)
        );
    }

    eliminarProducto(id: number): Observable<any> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete(url, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Producto eliminado:', response)),
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

