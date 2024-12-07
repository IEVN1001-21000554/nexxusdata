import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ChartOptions, ChartData } from 'chart.js';
import { DashboardService } from './dashboard.service';
import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterOutlet],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.obtenerVentasMensuales();
    this.obtenerClientesFrecuentes();

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
  }


  ventasMensualesLabels: string[] = [];
  ventasMensualesData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Ventas' }],
  };


  clientesFrecuentesLabels: string[] = [];
  clientesFrecuentesData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [], label: 'Clientes Frecuentes' }],
  };


  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  obtenerVentasMensuales(): void {
    this.dashboardService.getVentasMensuales().subscribe((response) => {
      const ventas = response.ventas_mensuales || [];
      this.ventasMensualesLabels = ventas.map((venta: any) => venta.fecha);
      this.ventasMensualesData = {
        labels: this.ventasMensualesLabels,
        datasets: [{ data: ventas.map((venta: any) => venta.total), label: 'Ventas' }],
      };
    });
  }

  obtenerClientesFrecuentes(): void {
    this.dashboardService.getClientesFrecuentes().subscribe((response) => {
      const clientes = response.clientes_frecuentes || [];
      this.clientesFrecuentesLabels = clientes.map((cliente: any) => cliente.cliente_nombre);
      this.clientesFrecuentesData = {
        labels: this.clientesFrecuentesLabels,
        datasets: [{ data: clientes.map((cliente: any) => cliente.total), label: 'Clientes Frecuentes' }],
      };
    });
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['']);
  }
}



