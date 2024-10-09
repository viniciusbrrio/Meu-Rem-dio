import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUserModalPage } from './add-user-modal.page';

describe('AddUserModalPage', () => {
  let component: AddUserModalPage;
  let fixture: ComponentFixture<AddUserModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
