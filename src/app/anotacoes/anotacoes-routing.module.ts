import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnotacoesPage } from './anotacoes.page';

const routes: Routes = [
  {
    path: '',
    component: AnotacoesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnotacoesPageRoutingModule {}
