import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceitasPageRoutingModule } from './receitas-routing.module';

import { ReceitasPage } from './receitas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceitasPageRoutingModule
  ],
  declarations: [ReceitasPage]
})
export class ReceitasPageModule {}
