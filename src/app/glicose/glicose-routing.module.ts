import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GlicosePage } from './glicose.page';

const routes: Routes = [
  {
    path: '',
    component: GlicosePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlicosePageRoutingModule {}
