import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MedicamentosPageRoutingModule } from './medicamentos-routing.module';
import { MedicamentosPage } from './medicamentos.page';  // Certifica-te de que o caminho está correto

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicamentosPageRoutingModule
  ],
  declarations: [MedicamentosPage] // Inclui a página nas declarações
})
export class MedicamentosPageModule {}

