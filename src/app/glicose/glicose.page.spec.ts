import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlicosePage } from './glicose.page';

describe('GlicosePage', () => {
  let component: GlicosePage;
  let fixture: ComponentFixture<GlicosePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GlicosePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
