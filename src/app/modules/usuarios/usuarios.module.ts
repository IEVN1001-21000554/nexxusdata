// src/app/modules/usuarios/usuarios.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuariosFormComponent } from './usuarios-form/usuarios-form.component';
import { UsuariosTablaComponent } from './usuarios-tabla/usuarios-tabla.component';

@NgModule({
  declarations: [UsuariosFormComponent, UsuariosTablaComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [UsuariosFormComponent, UsuariosTablaComponent]
})
export class UsuariosModule { }