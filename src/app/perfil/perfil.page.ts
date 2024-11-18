import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfilService } from '../services/perfil.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;
  modoEdicao = false;
  carregando = true;
  erro: string | null = null;
  userId: string = '';
  dadosPerfil?: any;

  constructor(
    private perfilService: PerfilService,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth 
  ) {
    this.perfilForm = this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      estado: ['', Validators.required],
      bairro: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
    });
  }

  async ngOnInit() {
    await this.obterUserId();
    this.carregarDadosPerfil();
  }

  async obterUserId() {
    const user = await firstValueFrom(this.afAuth.authState);
    if (user) {
      this.userId = user.uid;
      console.log('ID do usuário logado:', this.userId);
    } else {
      this.erro = 'Usuário não autenticado.';
    }
  }

  async carregarDadosPerfil() {
    if (!this.userId) return;

    this.carregando = true;
    this.erro = null;

    try {
      const loading = await this.loadingCtrl.create({
        message: 'Carregando perfil...',
      });
      await loading.present();

      const dados = await firstValueFrom(this.perfilService.getCadastroByUserId(this.userId));

      if (dados) {
        this.dadosPerfil = dados;
        this.perfilForm.patchValue(dados);
      } else {
        this.erro = 'Perfil não encontrado.';
      }
    } catch (error) {
      console.error('Erro ao carregar os dados do perfil:', error);
      this.erro = 'Erro ao carregar os dados do perfil.';
    } finally {
      this.carregando = false;
      const loading = await this.loadingCtrl.getTop();
      if (loading) {
        await loading.dismiss();
      }
    }
  }

  habilitarEdicao() {
    this.modoEdicao = true;
  }

  async salvarAlteracoes() {
    if (this.perfilForm.valid && this.dadosPerfil?.id) {
      const loading = await this.loadingCtrl.create({
        message: 'Salvando alterações...',
      });
      await loading.present();

      try {
        await this.perfilService.updateCadastro(this.dadosPerfil.id, this.perfilForm.value);
        this.modoEdicao = false;
        const toast = await this.toastCtrl.create({
          message: 'Perfil atualizado com sucesso!',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
      } catch (error) {
        const toast = await this.toastCtrl.create({
          message: 'Erro ao atualizar o perfil. Tente novamente.',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      } finally {
        loading.dismiss();
      }
    }
  }

  cancelarEdicao() {
    this.modoEdicao = false;
    if (this.dadosPerfil) {
      this.perfilForm.patchValue(this.dadosPerfil);
    }
  }

  formatarDataHora(): string {
    const dataNascimento = this.perfilForm.get('dataNascimento')?.value;
    if (!dataNascimento) {
      return ''; 
    }
    const data = new Date(dataNascimento);
    return data.toLocaleDateString('pt-BR');
  }
}

