import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentasFormComponent } from './ventas-form/ventas-form.component';
import { VentasTablaComponent } from './ventas-tabla/ventas-tabla.component';



@NgModule({
  declarations: [
    VentasFormComponent,
    VentasTablaComponent
  ],
  imports: [
    CommonModule
  ]
})
export class VentasModule { }
