import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-anotacoes',
  templateUrl: './anotacoes.page.html',
  styleUrls: ['./anotacoes.page.scss'],
})
export class AnotacoesPage {
  anotacoes: { conteudo: string; dataHora: Date }[] = [];
  anotacoesFiltradas: { conteudo: string; dataHora: Date }[] = [];

  constructor(private alertController: AlertController) {
    this.anotacoesFiltradas = this.anotacoes; // Inicializa as anotações filtradas
  }

  async adicionarNota() {
    const alert = await this.alertController.create({
      header: 'Adicionar Anotação',
      inputs: [
        {
          name: 'conteudo',
          type: 'text',
          placeholder: 'Digite sua anotação',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Salvar',
          handler: (data) => {
            if (data.conteudo) {
              const novaNota = { conteudo: data.conteudo, dataHora: new Date() };
              this.anotacoes.push(novaNota);
              this.anotacoesFiltradas.push(novaNota); // Adiciona à lista filtrada
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async editarNota(nota: any) {
    const alert = await this.alertController.create({
      header: 'Editar Anotação',
      inputs: [
        {
          name: 'conteudo',
          type: 'text',
          value: nota.conteudo,
          placeholder: 'Digite sua anotação',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Salvar',
          handler: (data) => {
            if (data.conteudo) {
              nota.conteudo = data.conteudo;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  excluirNota(nota: any) {
    this.anotacoes = this.anotacoes.filter((n) => n !== nota);
    this.anotacoesFiltradas = this.anotacoesFiltradas.filter((n) => n !== nota); // Atualiza a lista filtrada
  }

  filtrarAnotacoes(event: any) {
    const pesquisa = event.target.value.toLowerCase();
    this.anotacoesFiltradas = this.anotacoes.filter(nota =>
      nota.conteudo.toLowerCase().includes(pesquisa)
    );
  }
}
