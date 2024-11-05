import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulaPage } from './bula.page';

const routes: Routes = [
  {
    path: '',
    component: BulaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulaPageRoutingModule {}
