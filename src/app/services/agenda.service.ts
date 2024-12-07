import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, retry, map } from 'rxjs/operators';
import { Agenda } from '../interfaces/Agenda';

@Injectable({
    providedIn: 'root'
})
export class AgendaService {
    private apiUrl = 'http://127.0.0.1:5000/api/agenda';

    constructor(private http: HttpClient) { }

    obtenerAgendasFiltradas(anio: number, mes: number): Observable<Agenda[]> {
        return this.http.get<Agenda[]>(`${this.apiUrl}/filtro`, {
            headers: this.getHeaders(),
            params: { anio: anio.toString(), mes: mes.toString() },
            withCredentials: true
        }).pipe(
            retry(3),
            map(agendas => agendas.map(agenda => ({
                ...agenda,
                fecha_inicio: new Date(agenda.fecha_inicio),
                fecha_fin: new Date(agenda.fecha_fin)
            }))),
            catchError(this.handleError)
        );
    }

    obtenerEvento(id: number): Observable<Agenda> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Agenda>(url, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Respuesta completa:', response)),
            map(response => response.body as Agenda),
            catchError(this.handleError)
        );
    }

    nuevoAgenda(nuevaAgenda: Omit<Agenda, 'id'>): Observable<Agenda> {
        return this.http.post<Agenda>(this.apiUrl, nuevaAgenda, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Agenda creada:', response)),
            map(response => response.body as Agenda),
            catchError(this.handleError)
        );
    }

    actualizarAgenda(id: number, agendaActualizada: Partial<Agenda>): Observable<Agenda> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<Agenda>(url, agendaActualizada, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Agenda actualizada:', response)),
            map(response => response.body as Agenda),
            catchError(this.handleError)
        );
    }

    eliminarAgenda(id: number): Observable<any> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete(url, {
            headers: this.getHeaders(),
            withCredentials: true,
            observe: 'response'
        }).pipe(
            retry(3),
            tap(response => console.log('Agenda eliminada:', response)),
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


