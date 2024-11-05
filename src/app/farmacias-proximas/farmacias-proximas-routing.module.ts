import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FarmaciasProximasPage } from './farmacias-proximas.page';

const routes: Routes = [
  {
    path: '',
    component: FarmaciasProximasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmaciasProximasPageRoutingModule {}
