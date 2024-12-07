// src/app/modules/usuarios/usuarios-form/usuarios-form.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UsuariosService } from '../../../services/usuarios.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../../interfaces/Usuario';

@Component({
  selector: 'app-usuarios-form',
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.css'],
  imports: [CommonModule, DashboardComponent, ReactiveFormsModule],
  standalone: true
})
export class UsuariosFormComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  userId?: number;
  subscription: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usuariosService: UsuariosService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      rol: ['', Validators.required]
    });
    this.subscription = this.route.params.subscribe(params => {
      this.userId = parseInt(this.route.snapshot.url[2].path, 10);
    });
  }

  ngOnInit() {
    console.log(this.route.snapshot.url);
    if (this.route.snapshot.url[1].path === 'nuevo') {
      this.userForm.reset();
      this.userId = undefined;
    } else if (this.route.snapshot.url[1].path === 'editar') {
      if (this.userId) {
        this.getUsuario(this.userId);
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getUsuario(id: number) {
    this.usuariosService.obtenerUsuario(id).subscribe({
      next: response => {
        this.userForm.get('name')?.setValue(response.nombre);
        this.userForm.get('email')?.setValue(response.email);
        this.userForm.get('rol')?.setValue(response.rol);
        this.userForm.get('password')?.setValue('');
        this.userForm.get('activo')?.setValue(response.activo);
        if (response.id) {
          this.userForm.get('id')?.setValue(response.id);
        }
      },
      error: error => {
        Swal.fire({
          title: 'Error',
          text: 'No se encontro el usuario',
          icon: 'error'
        });
        this.router.navigate(['/usuarios']);
      }
    });
  }

  onSubmit() {
    const usuario: Usuario = {
      id: this.userId || 0,
      nombre: this.userForm.get('name')?.value,
      email: this.userForm.get('email')?.value,
      password: this.userForm.get('password')?.value, // Assuming password is handled separately
      rol: this.userForm.get('rol')?.value,
      activo: this.userForm.get('activo')?.value ?? true
    };
    if (this.userForm.valid) {
      if (this.userId) {
        this.usuariosService.actualizarUsuario(this.userId, usuario).subscribe({
          next: response => {
            console.log('Usuario actualizado:', response);
            Swal.fire('Actualizado', 'El usuario ha sido actualizado correctamente.', 'success');
            this.router.navigate(['/usuarios']);
          },
          error: error => {
            console.error('Error al actualizar el usuario:', error);
            Swal.fire('Error', 'Hubo un problema al actualizar el usuario, vuelve a intentarlo.', 'error');
          }
        });
      } else {
        this.usuariosService.nuevoUsuario(usuario).subscribe({
          next: response => {
            console.log('Usuario creado:', response);
            Swal.fire('Creado', 'El usuario ha sido creado correctamente.', 'success');
            this.router.navigate(['/usuarios']);
          },
          error: error => {
            console.error('Error al crear el usuario:', error);
            Swal.fire('Error', 'Hubo un problema al crear el usuario, vuelve a intentarlo.', 'error');
          }
        });
      }
    }
  }
}


