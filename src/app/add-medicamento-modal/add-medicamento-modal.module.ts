import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Importar ReactiveFormsModule
import { IonicModule } from '@ionic/angular';

import { AddMedicamentoModalPageRoutingModule } from './add-medicamento-modal-routing.module';
import { AddMedicamentoModalPage } from './add-medicamento-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,  // Adicionar ReactiveFormsModule aqui
    IonicModule,
    AddMedicamentoModalPageRoutingModule
  ],
  declarations: [AddMedicamentoModalPage]
})
export class AddMedicamentoModalPageModule {}
