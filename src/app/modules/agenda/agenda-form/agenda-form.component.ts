import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { AgendaService } from '../../../services/agenda.service';
import Swal from 'sweetalert2';
import { Agenda } from '../../../interfaces/Agenda';
import { ClientesService } from '../../../services/clientes.service';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-agenda-form',
  templateUrl: './agenda-form.component.html',
  styleUrls: ['./agenda-form.component.css'],
  imports: [CommonModule, DashboardComponent, ReactiveFormsModule],
  standalone: true
})
export class AgendaFormComponent implements OnInit, OnDestroy {
  agendaForm: FormGroup;
  agendaId?: number;
  subscription: any;
  clientes: any[] = [];
  usuarios: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private agendaService: AgendaService,
    private clientesService: ClientesService,
    private usuariosService: UsuariosService
  ) {
    this.agendaForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      estado: ['activo', Validators.required],
      tipo: ['cita', Validators.required],
      cliente_id: [1, Validators.required],
      usuario_id: [1, Validators.required]
    });
    this.subscription = this.route.params.subscribe(params => {
      this.agendaId = parseInt(this.route.snapshot.url[2].path, 10);
    });
  }

  ngOnInit() {
    this.getClientes();
    this.getUsuarios();
    const url = this.router.url;
    const queryParams = this.route.snapshot.queryParamMap;
    if (url.includes('nuevo')) {
      const fecha_inicio = queryParams.get('fecha_inicio');
      const fecha_fin = queryParams.get('fecha_fin');
      this.agendaForm.reset();
      if (fecha_inicio) {
        this.agendaForm.get('fecha_inicio')?.setValue(new Date(fecha_inicio).toISOString());
      }
      if (fecha_fin) {
        this.agendaForm.get('fecha_fin')?.setValue(new Date(fecha_fin).toISOString());
      }
      this.agendaId = undefined;
    } else if (url.includes('editar') && this.agendaId) {
      this.getAgenda(this.agendaId);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAgenda(id: number) {
    this.agendaService.obtenerEvento(id).subscribe({
      next: response => {
        this.agendaForm.patchValue(response);
      },
      error: error => {
        Swal.fire({
          title: 'Error',
          text: 'No se encontró la agenda',
          icon: 'error'
        });
        this.router.navigate(['/agendas']);
      }
    });
  }

  onSubmit() {
    if (this.agendaForm.valid) {
      const agenda: Agenda = {
        id: this.agendaId,
        cliente_id: this.agendaForm.get('cliente_id')?.value,
        usuario_id: this.agendaForm.get('usuario_id')?.value,
        titulo: this.agendaForm.get('titulo')?.value,
        descripcion: this.agendaForm.get('descripcion')?.value,
        fecha_inicio: new Date(this.agendaForm.get('fecha_inicio')?.value),
        fecha_fin: new Date(this.agendaForm.get('fecha_fin')?.value),
        estado: this.agendaForm.get('estado')?.value,
        tipo: this.agendaForm.get('tipo')?.value
      };

      if (this.agendaId) {
        this.agendaService.actualizarAgenda(this.agendaId, agenda).subscribe({
          next: response => {
            Swal.fire('Actualizado', 'La agenda ha sido actualizada correctamente.', 'success');
            this.router.navigate(['/agenda']);
          },
          error: error => {
            Swal.fire('Error', 'Hubo un problema al actualizar la agenda, vuelve a intentarlo.', 'error');
          }
        });
      } else {
        this.agendaService.nuevoAgenda(agenda).subscribe({
          next: response => {
            Swal.fire('Creado', 'La agenda ha sido creada correctamente.', 'success');
            this.router.navigate(['/agenda']);
          },
          error: error => {
            Swal.fire('Error', 'Hubo un problema al crear la agenda, vuelve a intentarlo.', 'error');
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
}


