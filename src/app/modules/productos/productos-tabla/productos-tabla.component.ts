import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../services/productos.service';
import { Router } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos-tabla',
  templateUrl: './productos-tabla.component.html',
  styleUrls: ['./productos-tabla.component.css'],
  imports: [CommonModule, DashboardComponent],
  standalone: true
})
export class ProductosTablaComponent {
  productos: any[] = [];

  constructor(
    private router: Router, private productosService: ProductosService,) { }

  ngOnInit(): void {
    this.getProductos();
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

  addProducto(): void {
    this.router.navigate(['/productos/nuevo']);
  }

  editProducto(productId: number): void {
    console.log('Edit product:', productId);
    this.router.navigate(['/productos/editar', productId]);
  }

  deleteProducto(productId: number): void {
    Swal.fire({
      title: 'Eliminar producto',
      text: 'Est s seguro de eliminar este producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productosService.eliminarProducto(productId).subscribe({
          next: (response) => {
            console.log('Producto eliminado:', response);
            Swal.fire('Eliminado', 'El producto ha sido eliminado correctamente.', 'success');
            this.getProductos();
          },
          error: (error) => {
            console.error('Error detallado al eliminar producto:', error);
            Swal.fire('Error', 'Hubo un problema al eliminar el producto, vuelve a intentarlo.', 'error');
          }
        });
      }
    });
  }
}

