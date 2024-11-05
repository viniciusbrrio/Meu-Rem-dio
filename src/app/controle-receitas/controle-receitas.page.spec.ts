import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControleReceitasPage } from './controle-receitas.page'; // Atualize aqui

describe('ControleReceitasPage', () => {
  let component: ControleReceitasPage; // Atualize aqui
  let fixture: ComponentFixture<ControleReceitasPage>; // Atualize aqui

  beforeEach(() => {
    fixture = TestBed.createComponent(ControleReceitasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

