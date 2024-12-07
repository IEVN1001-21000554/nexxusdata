import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ProductosService } from '../../../services/productos.service';
import Swal from 'sweetalert2';
import { Producto } from '../../../interfaces/Producto';

@Component({
  selector: 'app-productos-form',
  templateUrl: './productos-form.component.html',
  styleUrl: './productos-form.component.css',
  imports: [CommonModule, DashboardComponent, ReactiveFormsModule],
  standalone: true
})
export class ProductosFormComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  productId?: number;
  subscription: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productosService: ProductosService
  ) {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, Validators.required],
      stock: [0, Validators.required]
    });
    this.subscription = this.route.params.subscribe(params => {
      this.productId = parseInt(this.route.snapshot.url[2].path, 10);
    });
  }

  ngOnInit() {
    console.log(this.route.snapshot.url);
    if (this.route.snapshot.url[1].path === 'nuevo') {
      this.productForm.reset();
      this.productId = undefined;
    } else if (this.route.snapshot.url[1].path === 'editar') {
      if (this.productId) {
        this.getProducto(this.productId);
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getProducto(id: number) {
    this.productosService.obtenerProducto(id).subscribe({
      next: response => {
        this.productForm.get('nombre')?.setValue(response.nombre);
        this.productForm.get('descripcion')?.setValue(response.descripcion);
        this.productForm.get('precio')?.setValue(response.precio);
        this.productForm.get('stock')?.setValue(response.stock);
        if (response.id) {
          this.productForm.get('id')?.setValue(response.id);
        }
      },
      error: error => {
        Swal.fire({
          title: 'Error',
          text: 'No se encontro el producto',
          icon: 'error'
        });
        this.router.navigate(['/productos']);
      }
    });
  }

  onSubmit() {
    const producto: Producto = {
      id: this.productId || 0,
      nombre: this.productForm.get('nombre')?.value,
      descripcion: this.productForm.get('descripcion')?.value,
      precio: this.productForm.get('precio')?.value,
      stock: this.productForm.get('stock')?.value
    };
    if (this.productForm.valid) {
      if (this.productId) {
        this.productosService.actualizarProducto(this.productId, producto).subscribe({
          next: response => {
            console.log('Producto actualizado:', response);
            Swal.fire('Actualizado', 'El producto ha sido actualizado correctamente.', 'success');
            this.router.navigate(['/productos']);
          },
          error: error => {
            console.error('Error al actualizar el producto:', error);
            Swal.fire('Error', 'Hubo un problema al actualizar el producto, vuelve a intentarlo.', 'error');
          }
        });
      } else {
        this.productosService.nuevoProducto(producto).subscribe({
          next: response => {
            console.log('Producto creado:', response);
            Swal.fire('Creado', 'El producto ha sido creado correctamente.', 'success');
            this.router.navigate(['/productos']);
          },
          error: error => {
            console.error('Error al crear el producto:', error);
            Swal.fire('Error', 'Hubo un problema al crear el producto, vuelve a intentarlo.', 'error');
          }
        });
      }
    }
  }
}

