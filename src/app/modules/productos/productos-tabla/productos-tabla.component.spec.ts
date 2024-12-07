import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosTablaComponent } from './productos-tabla.component';

describe('ProductosTablaComponent', () => {
  let component: ProductosTablaComponent;
  let fixture: ComponentFixture<ProductosTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductosTablaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
