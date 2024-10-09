import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceitasPage } from './receitas.page';

describe('ReceitasPage', () => {
  let component: ReceitasPage;
  let fixture: ComponentFixture<ReceitasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceitasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
