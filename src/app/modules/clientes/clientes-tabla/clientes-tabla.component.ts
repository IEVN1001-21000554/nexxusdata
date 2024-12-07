import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../../services/clientes.service';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-clientes-tabla',
  templateUrl: './clientes-tabla.component.html',
  styleUrls: ['./clientes-tabla.component.css'],
  imports: [CommonModule, DashboardComponent],
  standalone: true
})
export class ClientesTablaComponent {
  clientes: any[] = [];

  constructor(
    private router: Router, private clientesService: ClientesService,) { }

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes(): void {
    this.clientesService.obtenerClientes().subscribe({
      next: (response) => {
        console.log('Clientes obtenidos:', response);
        this.clientes = response;
      },
      error: (error) => {
        console.error('Error detallado al obtener clientes:', error);
        Swal.fire('Error', 'Hubo un problema al obtener los clientes, vuelve a intentarlo.', 'error');
      }
    });
  }

  addCliente(): void {
    this.router.navigate(['/clientes/nuevo']);
  }

  editCliente(clienteId: number): void {
    console.log('Edit cliente:', clienteId);
    this.router.navigate(['/clientes/editar', clienteId]);
  }

  deleteCliente(clienteId: number): void {
    Swal.fire({
      title: 'Eliminar cliente',
      text: 'Est s seguro de eliminar este cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientesService.eliminarCliente(clienteId).subscribe({
          next: (response) => {
            console.log('Cliente eliminado:', response);
            Swal.fire('Eliminado', 'El cliente ha sido eliminado correctamente.', 'success');
            this.getClientes();
          },
          error: (error) => {
            console.error('Error detallado al eliminar cliente:', error);
            Swal.fire('Error', 'Hubo un problema al eliminar el cliente, vuelve a intentarlo.', 'error');
          }
        });
      }
    });
  }
}

