import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, retry, map } from 'rxjs/operators';
import { Venta } from '../interfaces/Venta';

@Injectable({
    providedIn: 'root'
})
export class VentasService {
    private apiUrl = 'http://127.0.0.1:5000/api/ventas';

    constructor(private http: HttpClient) { }

    obtenerVentas(): Observable<Venta[]> {
        return this.http.get<Venta[]>(this.apiUrl, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Ventas obtenidas:', response)),
            map(response => response.body as Venta[]),
            catchError(this.handleError)
        );
    }

    obtenerVenta(id: number): Observable<Venta> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Venta>(url, {
            headers: this.getHeaders(),
            withCredentials: true
        }).pipe(
            retry(3),
            tap(response => console.log('Venta obtenida:', response)),
            catchError(this.handleError)
        );
    }

    nuevaVenta(nuevaVenta: Omit<Venta, 'id'>): Observable<Venta> {
        return this.http.post<Venta>(this.apiUrl, nuevaVenta, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Venta creada:', response)),
            map(response => response.body as Venta),
            catchError(this.handleError)
        );
    }

    actualizarVenta(id: number, ventaActualizada: Partial<Venta>): Observable<Venta> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<Venta>(url, ventaActualizada, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Venta actualizada:', response)),
            map(response => response.body as Venta),
            catchError(this.handleError)
        );
    }

    eliminarVenta(id: number): Observable<any> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete(url, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Venta eliminada:', response)),
            map(response => response.body),
            catchError(this.handleError)
        );
    }

    generarFactura(id: number): Observable<any> {
        const url = `${this.apiUrl}/${id}/pdf`;
        return this.http.get(url, {
            headers: this.getHeaders(),
            withCredentials: true,
            responseType: 'arraybuffer'
        }).pipe(
            retry(3),
            tap(response => console.log('Factura generada:', response)),
            map(response => {
                const pdfBlob = new Blob([response], { type: 'application/pdf' });
                const pdfUrl = window.URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.setAttribute('download', `venta_${id}.pdf`);
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(pdfUrl);
                }, 0);
                return response;
            }),
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

