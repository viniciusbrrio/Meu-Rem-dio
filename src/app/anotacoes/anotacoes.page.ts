import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AnotacoesService, Anotacao } from '../services/anotacoes.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import firebase from 'firebase/compat/app'; // Importação do Firebase

@Component({
  selector: 'app-anotacoes',
  templateUrl: './anotacoes.page.html',
  styleUrls: ['./anotacoes.page.scss'],
})
export class AnotacoesPage implements OnInit {
  anotacoes: Anotacao[] = [];
  anotacoesFiltradas: Anotacao[] = [];
  user: User | undefined;

  constructor(
    private alertController: AlertController,
    private anotacoesService: AnotacoesService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(userId).subscribe(user => {
        this.user = user;
        if (this.user) {
          this.loadAnotacoes(this.user.id);
        }
      });
    }
  }

  // Carregar anotações do Firestore associadas ao usuário
  loadAnotacoes(userId: string) {
    this.anotacoesService.getAnotacoes(userId).subscribe((anotacoes) => {
      this.anotacoes = anotacoes;
      this.anotacoesFiltradas = [...this.anotacoes];
    });
  }

  formatarDataHora(dataHora: Date | firebase.firestore.Timestamp): string {
    return dataHora instanceof firebase.firestore.Timestamp
      ? dataHora.toDate().toLocaleString()
      : dataHora.toLocaleString();
  }

  async adicionarNota() {
    const alert = await this.alertController.create({
      header: 'Adicionar Anotação',
      inputs: [{ name: 'conteudo', type: 'text', placeholder: 'Digite sua anotação' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Salvar',
          handler: async (data) => {
            if (data.conteudo && this.user) {
              const novaNota: Anotacao = { conteudo: data.conteudo, dataHora: new Date(), userId: this.user.id };
              await this.anotacoesService.adicionarAnotacao(novaNota);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async editarNota(nota: Anotacao) {
    const alert = await this.alertController.create({
      header: 'Editar Anotação',
      inputs: [{ name: 'conteudo', type: 'text', value: nota.conteudo, placeholder: 'Digite sua anotação' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Salvar',
          handler: async (data) => {
            if (data.conteudo) {
              nota.conteudo = data.conteudo;
              await this.anotacoesService.editarAnotacao(nota);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  excluirNota(nota: Anotacao) {
    if (nota.id) {
      this.anotacoesService.excluirAnotacao(nota.id);
    }
  }

  filtrarAnotacoes(event: any) {
    const pesquisa = event.target.value.toLowerCase();
    this.anotacoesFiltradas = this.anotacoes.filter(nota => {
      const conteudoMatch = nota.conteudo.toLowerCase().includes(pesquisa);
      const dataHoraMatch = this.formatarDataHora(nota.dataHora).toLowerCase().includes(pesquisa);
      return conteudoMatch || dataHoraMatch;
    });
  }
}

