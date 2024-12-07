import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import LoginComponent from './modules/auth/login/login.component';
import { UsuariosTablaComponent } from './modules/usuarios/usuarios-tabla/usuarios-tabla.component';

import { GraficasComponent } from './modules/graficas/graficas.component';
import { UsuariosFormComponent } from './modules/usuarios/usuarios-form/usuarios-form.component';
import { ProductosTablaComponent } from './modules/productos/productos-tabla/productos-tabla.component';
import { ClientesTablaComponent } from './modules/clientes/clientes-tabla/clientes-tabla.component';
import { ClientesFormComponent } from './modules/clientes/clientes-form/clientes-form.component';
import { VentasTablaComponent } from './modules/ventas/ventas-tabla/ventas-tabla.component';
import { VentasFormComponent } from './modules/ventas/ventas-form/ventas-form.component';
import { ProductosFormComponent } from './modules/productos/productos-form/productos-form.component';
import { AgendaVistaComponent } from './modules/agenda/agenda-vista/agenda-vista.component';
import { AgendaFormComponent } from './modules/agenda/agenda-form/agenda-form.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },

  { path: 'dashboard', component: GraficasComponent, canActivate: [AuthGuard] },

  { path: 'usuarios', component: UsuariosTablaComponent, canActivate: [AuthGuard] },
  { path: 'usuarios/nuevo', component: UsuariosFormComponent, canActivate: [AuthGuard] },
  { path: 'usuarios/editar/:id', component: UsuariosFormComponent, canActivate: [AuthGuard] },

  { path: 'productos', component: ProductosTablaComponent, canActivate: [AuthGuard] },
  { path: 'productos/nuevo', component: ProductosFormComponent, canActivate: [AuthGuard] },
  { path: 'productos/editar/:id', component: ProductosFormComponent, canActivate: [AuthGuard] },

  { path: 'clientes', component: ClientesTablaComponent, canActivate: [AuthGuard] },
  { path: 'clientes/nuevo', component: ClientesFormComponent, canActivate: [AuthGuard] },
  { path: 'clientes/editar/:id', component: ClientesFormComponent, canActivate: [AuthGuard] },

  { path: 'agenda', component: AgendaVistaComponent, canActivate: [AuthGuard] },
  { path: 'agenda/nuevo', component: AgendaFormComponent, canActivate: [AuthGuard] },
  { path: 'agenda/editar/:id', component: AgendaFormComponent, canActivate: [AuthGuard] },

  { path: 'ventas', component: VentasTablaComponent, canActivate: [AuthGuard] },
  { path: 'ventas/nuevo', component: VentasFormComponent, canActivate: [AuthGuard] },
  { path: 'ventas/editar/:id', component: VentasFormComponent, canActivate: [AuthGuard] },

  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];