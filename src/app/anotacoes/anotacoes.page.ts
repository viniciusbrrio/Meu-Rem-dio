import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AnotacoesService, Anotacao } from '../services/anotacoes.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import firebase from 'firebase/compat/app'; // Importação do Firebase
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-anotacoes',
  templateUrl: './anotacoes.page.html',
  styleUrls: ['./anotacoes.page.scss'],
})
export class AnotacoesPage implements OnInit {
  anotacoes: Anotacao[] = [];
  anotacoesFiltradas: Anotacao[] = [];
  user: User | undefined;
  
  @ViewChild('pdfContent', { static: false }) pdfContent?: ElementRef;

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

  loadAnotacoes(userId: string) {
    this.anotacoesService.getAnotacoes(userId).subscribe((anotacoes) => {
      // Converte dataHora para Date
      this.anotacoes = anotacoes.map(nota => ({
        ...nota,
        dataHora: nota.dataHora instanceof firebase.firestore.Timestamp
          ? nota.dataHora.toDate() // Converte Timestamp para Date
          : new Date(nota.dataHora), // Converte string ou outro formato para Date
      }));
      this.anotacoesFiltradas = [...this.anotacoes];
    });
  }
  
  formatarDataHora(dataHora: Date | firebase.firestore.Timestamp): string {
    const data = dataHora instanceof firebase.firestore.Timestamp
      ? dataHora.toDate() // Converte para Date
      : new Date(dataHora); // Garante que seja um objeto Date
  
    // Formata no padrão dd/MM/yyyy - HH:mm
    return data.toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              this.loadAnotacoes(this.user.id); // Atualizar a lista após adicionar
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
              this.loadAnotacoes(this.user?.id || ''); // Atualizar lista
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async excluirNota(nota: Anotacao) {
    if (!nota.id) return;
    
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Deseja excluir esta anotação?',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Excluir',
          handler: async () => {
            await this.anotacoesService.excluirAnotacao(nota.id!);
            if (this.user) {
              this.loadAnotacoes(this.user.id); // Atualizar lista após exclusão
            }
          }
        }
      ]
    });
    await alert.present();
  }

  filtrarAnotacoes(event: any) {
    const pesquisa = event.target.value.toLowerCase();
    this.anotacoesFiltradas = this.anotacoes.filter(nota => {
      const conteudoMatch = nota.conteudo.toLowerCase().includes(pesquisa);
      const dataHoraMatch = this.formatarDataHora(nota.dataHora).toLowerCase().includes(pesquisa);
      return conteudoMatch || dataHoraMatch;
    });
  }

  async gerarPDF() {
    if (!this.pdfContent) {
      console.error('Elemento PDF não encontrado!');
      return;
    }
    
    const element = this.pdfContent.nativeElement;
    const pdf = new jsPDF('p', 'mm', 'a4');

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      // Adiciona o título com o nome do usuário
      if (this.user?.nome) {
        pdf.text(`Registro de Anotações de ${this.user.nome}`, 10, 10);
      }
      
      // Adiciona a imagem da tabela renderizada
      pdf.addImage(imgData, 'PNG', 10, 20, 190, 0);
      pdf.save('anotacoes.pdf');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  }
}

