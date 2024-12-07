import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Agenda } from '../../../interfaces/Agenda';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Router } from '@angular/router';
import esLocale from '@fullcalendar/core/locales/es';
import { AgendaService } from '../../../services/agenda.service';

@Component({
  selector: 'app-agenda-vista',
  templateUrl: './agenda-vista.component.html',
  styleUrls: ['./agenda-vista.component.css'],
  standalone: true,
  imports: [DashboardComponent, CommonModule, FullCalendarModule]
})
export class AgendaVistaComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: this.loadEvents.bind(this),
    eventClick: this.handleEventClick.bind(this),
    select: this.handleDateSelect.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    selectable: true,
    locale: esLocale,
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día'
    },
    datesSet: this.handleDatesSet.bind(this)
  };

  private currentYear: number;
  private currentMonth: number;

  constructor(
    private router: Router,
    private agendaService: AgendaService
  ) {
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth() + 1;
  }

  ngOnInit(): void {
    // Initial load is handled by datesSet
  }

  loadEvents(fetchInfo: any, successCallback: (events: EventInput[]) => void, failureCallback: (error: any) => void): void {
    this.getEventosPorMesAnio(this.currentYear, this.currentMonth)
      .then((events) => successCallback(events))
      .catch((error) => failureCallback(error));
  }

  handleEventClick(clickInfo: EventClickArg) {
    const eventId = clickInfo.event.extendedProps['id'];
    if (eventId) {
      this.router.navigate(['/agenda/editar', eventId]);
    }
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.router.navigate(['/agenda/nuevo'], {
      queryParams: {
        fecha_inicio: selectInfo.startStr,
        fecha_fin: selectInfo.endStr
      }
    });
  }

  handleDatesSet(info: any) {
    this.currentYear = info.view.currentStart.getFullYear();
    this.currentMonth = info.view.currentStart.getMonth() + 1;
    this.calendarOptions.events = this.loadEvents.bind(this);
  }

  addEvento() {
    this.router.navigate(['/agenda/nuevo']);
  }

  private getEventosPorMesAnio(anio: number, mes: number): Promise<EventInput[]> {
    return new Promise((resolve, reject) => {
      this.agendaService.obtenerAgendasFiltradas(anio, mes).subscribe({
        next: (agendas) => {
          const events = agendas.map(evento => ({
            title: evento.titulo,
            start: evento.fecha_inicio,
            end: evento.fecha_fin,
            extendedProps: {
              id: evento.id,
              description: evento.descripcion,
              status: evento.estado,
              tipo: evento.tipo,
              cliente_id: evento.cliente?.id,
              usuario_id: evento.usuario_id
            }
          }));
          resolve(events);
        },
        error: (error) => {
          console.error('Error al obtener eventos:', error);
          reject(error);
        }
      });
    });
  }
}