import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PainelPage } from './painel.page';

const routes: Routes = [
  {
    path: '',
    component: PainelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PainelPageRoutingModule {}
