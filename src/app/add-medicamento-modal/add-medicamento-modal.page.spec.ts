import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMedicamentoModalPage } from './add-medicamento-modal.page';

describe('AddMedicamentoModalPage', () => {
  let component: AddMedicamentoModalPage;
  let fixture: ComponentFixture<AddMedicamentoModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMedicamentoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
