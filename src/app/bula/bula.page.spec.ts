import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BulaPage } from './bula.page';

describe('BulaPage', () => {
  let component: BulaPage;
  let fixture: ComponentFixture<BulaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BulaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
