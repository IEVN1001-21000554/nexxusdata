import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosTablaComponent } from './productos-tabla/productos-tabla.component';
import { ProductosFormComponent } from './productos-form/productos-form.component';



@NgModule({
  declarations: [
    ProductosTablaComponent,
    ProductosFormComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ProductosModule { }
