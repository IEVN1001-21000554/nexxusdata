import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaVistaComponent } from './agenda-vista.component';

describe('AgendaVistaComponent', () => {
  let component: AgendaVistaComponent;
  let fixture: ComponentFixture<AgendaVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgendaVistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendaVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
