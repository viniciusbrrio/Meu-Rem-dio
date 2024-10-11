import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PressaoPage } from './pressao.page';

const routes: Routes = [
  {
    path: '',
    component: PressaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PressaoPageRoutingModule {}
