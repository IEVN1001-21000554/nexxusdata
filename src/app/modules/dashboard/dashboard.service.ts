import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = 'http://127.0.0.1:5000/dashboard';

  constructor(private http: HttpClient) {}

  getVentasMensuales(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ventas-mensuales`);
  }

  getClientesFrecuentes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/clientes-frecuentes`);
  }
}



// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class DashboardService {
//   private baseUrl = 'http://127.0.0.1:5000/dashboard';

//   constructor(private http: HttpClient) {}

//   obtenerVentasPorDia(): Observable<any> {
//     return this.http.get(`${this.baseUrl}/ventas-dia`);
//   }

//   obtenerTopClientes(): Observable<any> {
//     return this.http.get(`${this.baseUrl}/top-clientes`);
//   }

//   obtenerTopProductos(): Observable<any> {
//     return this.http.get(`${this.baseUrl}/top-productos`);
//   }

//   obtenerVentasPorVendedor(): Observable<any> {
//     return this.http.get(`${this.baseUrl}/ventas-vendedor`);
//   }

//   obtenerVentasPorEstado(): Observable<any> {
//     return this.http.get(`${this.baseUrl}/ventas-estado`);
//   }
// }








// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class DashboardService {
//   private baseUrl = 'http://127.0.0.1:5000/dashboard';

//   constructor(private http: HttpClient) {}

//   getVentasPorDia(): Observable<any> {
//     return this.http.get(`${this.baseUrl}/ventas-dia`);
//   }

//   getVentasPorEstado(): Observable<any> {
//     return this.http.get(`${this.baseUrl}/ventas-estado`);
//   }

//   getTopProductos(): Observable<any> {
//     return this.http.get(`${this.baseUrl}/top-productos`);
//   }

//   getTopClientes(): Observable<any> {
//     return this.http.get(`${this.baseUrl}/top-clientes`);
//   }

//   getVentasPorVendedor(): Observable<any> {
//     return this.http.get(`${this.baseUrl}/ventas-vendedor`);
//   }

//     // Obtener datos de clientes frecuentes
//   getClientesFrecuentes(): Observable<any> {
//     return this.http.get(`${this.baseUrl}/clientes-frecuentes`);
//   }
// }






// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class DashboardService {
//   private baseUrl = 'http://127.0.0.1:5000/dashboard';

//   constructor(private http: HttpClient) {}

//   // Obtener datos de ventas mensuales
//   getVentasMensuales(): Observable<any> {
//     return this.http.get(`${this.baseUrl}/ventas-mensuales`);
//   }

//   // Obtener datos de clientes frecuentes
//   getClientesFrecuentes(): Observable<any> {
//     return this.http.get(`${this.baseUrl}/clientes-frecuentes`);
//   }
// }
