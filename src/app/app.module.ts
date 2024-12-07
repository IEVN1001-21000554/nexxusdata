// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { GraficasComponent } from './modules/graficas/graficas.component';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  declarations: [AppComponent, GraficasComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    UsuariosModule,
    FullCalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }