import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FarmaciasProximasPage } from './farmacias-proximas.page';

describe('FarmaciasProximasPage', () => {
  let component: FarmaciasProximasPage;
  let fixture: ComponentFixture<FarmaciasProximasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmaciasProximasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
