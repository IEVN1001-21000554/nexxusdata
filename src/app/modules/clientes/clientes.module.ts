import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesTablaComponent } from './clientes-tabla/clientes-tabla.component';
import { ClientesFormComponent } from './clientes-form/clientes-form.component';



@NgModule({
  declarations: [
    ClientesTablaComponent,
    ClientesFormComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ClientesModule { }
