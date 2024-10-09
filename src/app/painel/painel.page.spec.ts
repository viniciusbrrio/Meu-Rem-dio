import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PainelPage } from './painel.page';

describe('PainelPage', () => {
  let component: PainelPage;
  let fixture: ComponentFixture<PainelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
