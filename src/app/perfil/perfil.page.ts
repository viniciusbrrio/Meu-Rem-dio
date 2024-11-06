import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CadastroService } from '../services/cadastro.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  userProfile: any = {
    nome: '',
    sobrenome: '',
    email: '',
    dataNascimento: '',
    bairro: '',
    estado: ''
  };
  carregando: boolean = true;
  erro: string | null = null;

  constructor(
    private afAuth: AngularFireAuth,
    private cadastroService: CadastroService
  ) {}

  ngOnInit() {
    this.carregarDadosPerfil();
  }

  async carregarDadosPerfil() {
    this.carregando = true;
    this.erro = null;

    try {
      const user = await this.afAuth.currentUser; // Obtém o usuário autenticado
      const userId = user?.uid; // Pega o ID do usuário

      if (userId) {
        // Busca o perfil do usuário usando o userId
        this.cadastroService.getCadastros(userId).subscribe({
          next: (dados) => {
            if (dados) {
              this.userProfile = dados; // Atualiza o perfil com os dados do Firestore
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



