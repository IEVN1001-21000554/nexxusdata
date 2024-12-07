import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ClientesService } from '../../../services/clientes.service';
import Swal from 'sweetalert2';
import { Cliente } from '../../../interfaces/Cliente';

@Component({
  selector: 'app-clientes-form',
  templateUrl: './clientes-form.component.html',
  styleUrl: './clientes-form.component.css',
  imports: [CommonModule, DashboardComponent, ReactiveFormsModule],
  standalone: true
})
export class ClientesFormComponent implements OnInit, OnDestroy {
  clientForm: FormGroup;
  clientId?: number;
  subscription: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientesService: ClientesService
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: ['']
    });
    this.subscription = this.route.params.subscribe(params => {
      this.clientId = parseInt(this.route.snapshot.url[2].path, 10);
    });
  }

  ngOnInit() {
    console.log(this.route.snapshot.url);
    if (this.route.snapshot.url[1].path === 'nuevo') {
      this.clientForm.reset();
      this.clientId = undefined;
    } else if (this.route.snapshot.url[1].path === 'editar') {
      if (this.clientId) {
        this.getCliente(this.clientId);
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getCliente(id: number) {
    this.clientesService.obtenerCliente(id).subscribe({
      next: response => {
        this.clientForm.get('name')?.setValue(response.nombre);
        this.clientForm.get('email')?.setValue(response.email);
        this.clientForm.get('telefono')?.setValue(response.telefono);
        this.clientForm.get('direccion')?.setValue(response.direccion);
        if (response.id) {
          this.clientForm.get('id')?.setValue(response.id);
        }
      },
      error: error => {
        Swal.fire({
          title: 'Error',
          text: 'No se encontro el cliente',
          icon: 'error'
        });
        this.router.navigate(['/clientes']);
      }
    });
  }

  onSubmit() {
    const cliente: Cliente = {
      id: this.clientId || 0,
      nombre: this.clientForm.get('name')?.value,
      email: this.clientForm.get('email')?.value,
      telefono: this.clientForm.get('telefono')?.value,
      direccion: this.clientForm.get('direccion')?.value,
    };
    if (this.clientForm.valid) {
      if (this.clientId) {
        this.clientesService.actualizarCliente(this.clientId, cliente).subscribe({
          next: response => {
            console.log('Cliente actualizado:', response);
            Swal.fire('Actualizado', 'El cliente ha sido actualizado correctamente.', 'success');
            this.router.navigate(['/clientes']);
          },
          error: error => {
            console.error('Error al actualizar el cliente:', error);
            Swal.fire('Error', 'Hubo un problema al actualizar el cliente, vuelve a intentarlo.', 'error');
          }
        });
      } else {
        this.clientesService.nuevoCliente(cliente).subscribe({
          next: response => {
            console.log('Cliente creado:', response);
            Swal.fire('Creado', 'El cliente ha sido creado correctamente.', 'success');
            this.router.navigate(['/clientes']);
          },
          error: error => {
            console.error('Error al crear el cliente:', error);
            Swal.fire('Error', 'Hubo un problema al crear el cliente, vuelve a intentarlo.', 'error');
          }
        });
      }
    }
  }
}

