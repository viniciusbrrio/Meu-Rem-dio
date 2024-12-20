import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { PainelPage } from './painel/painel.page';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },

  { path: 'cadastro', loadChildren: () => import('./cadastro/cadastro.module').then(m => m.CadastroPageModule) },

  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  {
    path: 'add-user-modal',
    loadChildren: () => import('./add-user-modal/add-user-modal.module').then( m => m.AddUserModalPageModule)
  },
  {
    path: 'painel/:id',
    loadChildren: () => import('./painel/painel.module').then( m => m.PainelPageModule)
  },

  {
    path: 'perfil/:id',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'medicamentos/:id',
    loadChildren: () => import('./medicamentos/medicamentos.module').then( m => m.MedicamentosPageModule)
  },
  {
    path: 'add-medicamento-modal',
    loadChildren: () => import('./add-medicamento-modal/add-medicamento-modal.module').then( m => m.AddMedicamentoModalPageModule)
  },
  {
    path: 'controle-receitas/:id',
    loadChildren: () => import('./controle-receitas/receitas.module').then( m => m.ReceitasPageModule)
  },
  {
    path: 'consulta/:id',
    loadChildren: () => import('./consulta/consulta.module').then( m => m.ConsultaPageModule)
  },
  {
    path: 'pressao/:id',
    loadChildren: () => import('./pressao/pressao.module').then( m => m.PressaoPageModule)
  },
  {
    path: 'glicose/:id',
    loadChildren: () => import('./glicose/glicose.module').then( m => m.GlicosePageModule)
  },
  {
    path: 'anotacoes/:id',
    loadChildren: () => import('./anotacoes/anotacoes.module').then( m => m.AnotacoesPageModule)
  },
  {
    path: 'farmacias-proximas/:id',
    loadChildren: () => import('./farmacias-proximas/farmacias-proximas.module').then(m => m.FarmaciasProximasPageModule)
  },
  {
    path: 'alertas/:id',
    loadChildren: () => import('./alertas/alertas.module').then( m => m.AlertasPageModule)
  },
  
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

