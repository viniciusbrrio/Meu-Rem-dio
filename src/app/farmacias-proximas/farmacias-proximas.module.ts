import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FarmaciasProximasPage } from './farmacias-proximas.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: FarmaciasProximasPage }]) // Aqui deve ser configurada a rota do componente
  ],
  declarations: [FarmaciasProximasPage]
})
export class FarmaciasProximasPageModule {}
