import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasTablaComponent } from './ventas-tabla.component';

describe('VentasTablaComponent', () => {
  let component: VentasTablaComponent;
  let fixture: ComponentFixture<VentasTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VentasTablaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
