import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { VentasService } from '../../../services/ventas.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Venta, DetalleVenta } from '../../../interfaces/Venta';
import { ClientesService } from '../../../services/clientes.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { ProductosService } from '../../../services/productos.service';

@Component({
  selector: 'app-ventas-form',
  templateUrl: './ventas-form.component.html',
  styleUrls: ['./ventas-form.component.css'],
  imports: [CommonModule, DashboardComponent, ReactiveFormsModule],
  standalone: true
})
export class VentasFormComponent implements OnInit, OnDestroy {
  ventaForm: FormGroup;
  ventaId?: number;
  subscription: any;
  clientes: any[] = [];
  usuarios: any[] = [];
  productos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ventasService: VentasService,
    private clientesService: ClientesService,
    private usuariosService: UsuariosService,
    private productosService: ProductosService
  ) {
    this.ventaForm = this.fb.group({
      cliente_id: ['', Validators.required],
      fecha_venta: [new Date().toISOString().split('T')[0], Validators.required],
      detalles: this.fb.array([]),
      notas: [''],
      estado: ['pendiente'],
      usuario_id: ['']
    });
    this.subscription = this.route.params.subscribe(params => {
      this.ventaId = parseInt(this.route.snapshot.url[2]?.path, 10);
    });
  }

  ngOnInit() {
    this.getClientes();
    this.getUsuarios();
    this.getProductos();
    const url = this.router.url;
    if (url.includes('nuevo')) {
      this.addProducto();
    } else if (url.includes('editar') && this.ventaId) {
      this.getVenta(this.ventaId);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get detalles() {
    return this.ventaForm.get('detalles') as FormArray;
  }

  addProducto() {
    const detalleForm = this.fb.group({
      producto_id: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio_unitario: [0, Validators.required],
      subtotal: [0]
    });
    this.detalles.push(detalleForm);
  }

  removeProducto(index: number) {
    this.detalles.removeAt(index);
  }

  getVenta(id: number) {
    this.ventasService.obtenerVenta(id).subscribe({
      next: (response: Venta) => {
        this.ventaForm.patchValue({
          cliente_id: response.cliente_id,
          fecha_venta: response.fecha_venta?.split('T')[0],
          notas: response.notas,
          estado: response.estado,
          usuario_id: response.usuario_id
        });
        this.detalles.clear();
        response.detalles.forEach(detalle => {
          this.detalles.push(this.fb.group({
            producto_id: [detalle.producto_id, Validators.required],
            cantidad: [detalle.cantidad, [Validators.required, Validators.min(1)]],
            precio_unitario: [detalle.precio_unitario, Validators.required]
          }));
        });
      },
      error: error => {
        Swal.fire({
          title: 'Error',
          text: 'No se encontró la venta',
          icon: 'error'
        });
        this.router.navigate(['/ventas']);
      }
    });
  }

  onSubmit() {
    if (this.ventaForm.valid) {
      const venta: Venta = {
        id: this.ventaId || 0,
        cliente_id: this.ventaForm.get('cliente_id')?.value,
        fecha_venta: this.ventaForm.get('fecha_venta')?.value,
        notas: this.ventaForm.get('notas')?.value,
        estado: this.ventaForm.get('estado')?.value,
        usuario_id: this.ventaForm.get('usuario_id')?.value,
        detalles: this.ventaForm.get('detalles')?.value.map((detalle: any) => ({
          producto_id: detalle.producto_id,
          cantidad: detalle.cantidad
        }))
      };

      if (this.ventaId) {
        this.ventasService.actualizarVenta(this.ventaId, venta).subscribe({
          next: response => {
            Swal.fire('Actualizado', 'La venta ha sido actualizada correctamente.', 'success');
            this.router.navigate(['/ventas']);
          },
          error: error => {
            Swal.fire('Error', 'Hubo un problema al actualizar la venta, vuelve a intentarlo.', 'error');
          }
        });
      } else {
        this.ventasService.nuevaVenta(venta).subscribe({
          next: response => {
            Swal.fire('Creado', 'La venta ha sido creada correctamente.', 'success');
            this.router.navigate(['/ventas']);
          },
          error: error => {
            Swal.fire('Error', 'Hubo un problema al crear la venta, vuelve a intentarlo.', 'error');
          }
        });
      }
    }
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

  getUsuarios(): void {
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (response) => {
        console.log('Usuarios obtenidos:', response);
        this.usuarios = response;
      },
      error: (error) => {
        console.error('Error detallado al obtener usuarios:', error);
        Swal.fire('Error', 'Hubo un problema al obtener los usuarios, vuelve a intentarlo.', 'error');
      }
    });
  }

  getProductos(): void {
    this.productosService.obtenerProductos().subscribe({
      next: (response) => {
        console.log('Productos obtenidos:', response);
        this.productos = response;
      },
      error: (error) => {
        console.error('Error detallado al obtener productos:', error);
        Swal.fire('Error', 'Hubo un problema al obtener los productos, vuelve a intentarlo.', 'error');
      }
    });
  }

  calcularSubtotal(index: number) {
    const detalle = this.detalles.at(index) as FormGroup;
    const cantidad = detalle.get('cantidad')?.value;
    const precioUnitario = detalle.get('precio_unitario')?.value;
    const subtotal = cantidad * precioUnitario;
    detalle.patchValue({ subtotal: subtotal });
  }
}

