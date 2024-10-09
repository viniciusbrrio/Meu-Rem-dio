import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule
import { IonicModule } from '@ionic/angular';

import { AddUserModalPageRoutingModule } from './add-user-modal-routing.module';
import { AddUserModalPage } from './add-user-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Adicionar ReactiveFormsModule aqui
    IonicModule,
    AddUserModalPageRoutingModule
  ],
  declarations: [AddUserModalPage]
})
export class AddUserModalPageModule {}

