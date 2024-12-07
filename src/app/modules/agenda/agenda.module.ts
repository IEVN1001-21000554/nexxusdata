import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaVistaComponent } from './agenda-vista/agenda-vista.component';
import { AgendaFormComponent } from './agenda-form/agenda-form.component';



@NgModule({
  declarations: [
    AgendaVistaComponent,
    AgendaFormComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AgendaModule { }
