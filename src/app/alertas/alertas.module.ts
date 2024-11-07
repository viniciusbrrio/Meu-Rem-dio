import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertasPageRoutingModule } from './alertas-routing.module';

import { AlertasPage } from './alertas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertasPageRoutingModule
  ],
  declarations: [AlertasPage]
})
export class AlertasPageModule {}
