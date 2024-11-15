import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PerfilService, UserProfile } from '../services/perfil.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  userProfile: UserProfile = {
    nome: '',
    sobrenome: '',
    dataNascimento: '',
    estado: '',
    bairro: '',
    email: '',
    userId: ''
  };
  carregando: boolean = true;
  erro: string | null = null;

  constructor(
    private afAuth: AngularFireAuth,
    private perfilService: PerfilService
  ) {}

  ngOnInit() {
    this.carregarDadosPerfil();
  }

  async carregarDadosPerfil() {
    this.carregando = true;
    this.erro = null;

    try {
      const user = await this.afAuth.currentUser;
      const userId = user?.uid;

      if (userId) {
        this.perfilService.getUserProfile(userId).subscribe({
          next: (dados) => {
            if (dados) {
              this.userProfile = dados;
            } else {
              this.erro = 'Perfil não encontrado.';
            }
            this.carregando = false;
          },
          error: (error) => {
            console.error('Erro ao carregar perfil:', error);
            this.erro = 'Erro ao carregar os dados do perfil. Tente novamente.';
            this.carregando = false;
          }
        });
      } else {
        this.erro = 'Usuário não autenticado.';
        this.carregando = false;
      }
    } catch (error) {
      console.error('Erro ao obter usuário autenticado:', error);
      this.erro = 'Erro ao carregar os dados do perfil. Tente novamente.';
      this.carregando = false;
    }
  }
}

