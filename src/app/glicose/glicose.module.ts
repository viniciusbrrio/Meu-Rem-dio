import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GlicosePageRoutingModule } from './glicose-routing.module';

import { GlicosePage } from './glicose.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GlicosePageRoutingModule
  ],
  declarations: [GlicosePage]
})
export class GlicosePageModule {}
