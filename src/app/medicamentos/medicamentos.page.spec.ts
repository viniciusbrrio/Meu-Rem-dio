import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicamentosPage } from './medicamentos.page';

describe('MedicamentosPage', () => {
  let component: MedicamentosPage;
  let fixture: ComponentFixture<MedicamentosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicamentosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
