import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PressaoPageRoutingModule } from './pressao-routing.module';

import { PressaoPage } from './pressao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PressaoPageRoutingModule
  ],
  declarations: [PressaoPage]
})
export class PressaoPageModule {}
