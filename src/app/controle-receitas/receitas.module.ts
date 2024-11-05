import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReceitasPageRoutingModule } from './controle-receitas-routing.module';
import { ControleReceitasPage } from './controle-receitas.page'; // Atualize aqui

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceitasPageRoutingModule
  ],
  declarations: [ControleReceitasPage] // Atualize aqui
})
export class ReceitasPageModule {}

