import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceitasPage } from './receitas.page';

const routes: Routes = [
  {
    path: '',
    component: ReceitasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceitasPageRoutingModule {}
