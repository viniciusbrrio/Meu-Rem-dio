import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Altere ReceitasPage para ControleReceitasPage
import { ControleReceitasPage } from './controle-receitas.page';

const routes: Routes = [
  {
    path: '',
    component: ControleReceitasPage // Use ControleReceitasPage aqui
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceitasPageRoutingModule {}


