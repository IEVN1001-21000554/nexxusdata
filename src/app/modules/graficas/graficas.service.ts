import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private baseUrl = 'http://127.0.0.1:5000/dashboard';

    constructor(private http: HttpClient) { }

    getVentasMensuales(): Observable<any> {
        return this.http.get(`${this.baseUrl}/ventas-mensuales`);
    }

    getClientesFrecuentes(): Observable<any> {
        return this.http.get(`${this.baseUrl}/clientes-frecuentes`);
    }
}