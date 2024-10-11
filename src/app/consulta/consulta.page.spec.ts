import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaPage } from './consulta.page';

describe('ConsultaPage', () => {
  let component: ConsultaPage;
  let fixture: ComponentFixture<ConsultaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
