import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PressaoPage } from './pressao.page';

describe('PressaoPage', () => {
  let component: PressaoPage;
  let fixture: ComponentFixture<PressaoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PressaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
