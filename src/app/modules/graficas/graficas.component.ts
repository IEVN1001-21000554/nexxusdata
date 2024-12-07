import { Component } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VentasService } from '../../services/ventas.service';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';
import { Venta } from '../../interfaces/Venta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrl: './graficas.component.css',
  imports: [CommonModule, DashboardComponent, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  standalone: true
})
export class GraficasComponent {
  ventas: Venta[] = [];

  constructor(private router: Router, private ventasService: VentasService) { }

  ngOnInit(): void {
    this.getVentas();

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

  getVentas(): void {
    this.ventasService.obtenerVentas().subscribe({
      next: (response: Venta[]) => {
        console.log('Ventas obtenidas:', response);
        this.ventas = response;
        this.procesarDatosVentasMensuales();
        this.procesarDatosClientesFrecuentes();
      },
      error: (error) => {
        console.error('Error detallado al obtener ventas:', error);
        Swal.fire('Error', 'Hubo un problema al obtener las ventas, vuelve a intentarlo.', 'error');
      }
    });
  }

  procesarDatosVentasMensuales(): void {
    const ventasPorMes = new Map<string, number>();

    this.ventas.forEach(venta => {
      const fecha = venta.fecha_venta ? new Date(venta.fecha_venta) : new Date();
      const mesAnio = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
      const montoActual = ventasPorMes.get(mesAnio) || 0;
      ventasPorMes.set(mesAnio, montoActual + (venta.monto_total ? parseFloat(venta.monto_total.toString()) : 0));
    });

    const mesesOrdenados = Array.from(ventasPorMes.keys()).sort();

    this.ventasMensualesLabels = mesesOrdenados;
    this.ventasMensualesData = {
      labels: mesesOrdenados,
      datasets: [{
        data: mesesOrdenados.map(mes => ventasPorMes.get(mes) || 0),
        label: 'Ventas Mensuales'
      }]
    };
  }

  procesarDatosClientesFrecuentes(): void {
    const ventasPorCliente = new Map<string, number>();

    this.ventas.forEach(venta => {
      const montoActual = ventasPorCliente.get(venta.cliente || '') || 0;
      ventasPorCliente.set(venta.cliente || '', montoActual + (venta.monto_total ? venta.monto_total : 0));
    });

    const clientesOrdenados = Array.from(ventasPorCliente.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);  // Tomamos los 5 clientes que más compran

    this.clientesFrecuentesLabels = clientesOrdenados.map(([cliente]) => cliente);
    this.clientesFrecuentesData = {
      labels: this.clientesFrecuentesLabels,
      datasets: [{
        data: clientesOrdenados.map(([, monto]) => monto),
        label: 'Clientes Frecuentes'
      }]
    };
  }

}
