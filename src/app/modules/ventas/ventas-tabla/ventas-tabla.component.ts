import { Component, OnInit } from '@angular/core';
import { VentasService } from '../../../services/ventas.service';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas-tabla',
  templateUrl: './ventas-tabla.component.html',
  styleUrls: ['./ventas-tabla.component.css'],
  imports: [CommonModule, DashboardComponent],
  standalone: true
})
export class VentasTablaComponent {
  ventas: any[] = [];

  constructor(
    private router: Router, private ventasService: VentasService,) { }

  ngOnInit(): void {
    this.getVentas();
  }

  getVentas(): void {
    this.ventasService.obtenerVentas().subscribe({
      next: (response) => {
        console.log('Ventas obtenidas:', response);
        this.ventas = response;
      },
      error: (error) => {
        console.error('Error detallado al obtener ventas:', error);
        Swal.fire('Error', 'Hubo un problema al obtener las ventas, vuelve a intentarlo.', 'error');
      }
    });
  }

  addVenta(): void {
    this.router.navigate(['/ventas/nuevo']);
  }

  editVenta(ventaId: number): void {
    console.log('Edit venta:', ventaId);
    this.router.navigate(['/ventas/editar', ventaId]);
  }

  deleteVenta(ventaId: number): void {
    Swal.fire({
      title: 'Eliminar venta',
      text: 'Est s seguro de eliminar esta venta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ventasService.eliminarVenta(ventaId).subscribe({
          next: (response) => {
            console.log('Venta eliminada:', response);
            Swal.fire('Eliminado', 'La venta ha sido eliminada correctamente.', 'success');
            this.getVentas();
          },
          error: (error) => {
            console.error('Error detallado al eliminar venta:', error);
            Swal.fire('Error', 'Hubo un problema al eliminar la venta, vuelve a intentarlo.', 'error');
          }
        });
      }
    });
  }

  getFactura(ventaId: number): void {
    this.ventasService.generarFactura(ventaId).subscribe({
      next: (response) => {
        console.log('Factura generada:', response);
        const pdfBlob = new Blob([response], { type: 'application/pdf' });
        const pdfUrl = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', `venta_${ventaId}.pdf`);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(pdfUrl);
        }, 0);
      },
      error: (error) => {
        console.error('Error detallado al generar factura:', error);
        Swal.fire('Error', 'Hubo un problema al generar la factura, vuelve a intentarlo.', 'error');
      }
    });
  }
}

