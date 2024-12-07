// src/app/modules/usuarios/usuarios-tabla/usuarios-tabla.component.ts
import { Component, OnInit } from '@angular/core';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../../services/usuarios.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios-tabla',
  templateUrl: './usuarios-tabla.component.html',
  styleUrls: ['./usuarios-tabla.component.css'],
  imports: [CommonModule, DashboardComponent],
  standalone: true
})
export class UsuariosTablaComponent implements OnInit {
  users: any[] = [];

  constructor(
    private router: Router, private usuariosService: UsuariosService,) { }

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios(): void {
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (response) => {
        console.log('Usuarios obtenidos:', response);
        this.users = response;
      },
      error: (error) => {
        console.error('Error detallado al obtener usuarios:', error);
        Swal.fire('Error', 'Hubo un problema al obtener los usuarios, vuelve a intentarlo.', 'error');
      }
    });
  }

  addUsuario(): void {
    this.router.navigate(['/usuarios/nuevo']);
  }

  editUser(userId: number): void {
    console.log('Edit user:', userId);
    this.router.navigate(['/usuarios/editar', userId]);
  }

  deleteUser(userId: number): void {
    Swal.fire({
      title: 'Eliminar usuario',
      text: 'Est s seguro de eliminar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.eliminarUsuario(userId).subscribe({
          next: (response) => {
            console.log('Usuario eliminado:', response);
            Swal.fire('Eliminado', 'El usuario ha sido eliminado correctamente.', 'success');
            this.getUsuarios();
          },
          error: (error) => {
            console.error('Error detallado al eliminar usuario:', error);
            Swal.fire('Error', 'Hubo un problema al eliminar el usuario, vuelve a intentarlo.', 'error');
          }
        });
      }
    });
  }
}