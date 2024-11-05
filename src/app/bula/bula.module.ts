import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BulaPageRoutingModule } from './bula-routing.module';

import { BulaPage } from './bula.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BulaPageRoutingModule
  ],
  declarations: [BulaPage]
})
export class BulaPageModule {}
