import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PressaoService } from '../services/pressao.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Pressao } from '../interfaces/pressao.interface';
import { User } from '../models/user.model';
import firebase from 'firebase/compat/app';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-pressao',
  templateUrl: './pressao.page.html',
  styleUrls: ['./pressao.page.scss'],
})
export class PressaoPage implements OnInit {
  pressao: Pressao[] = [];
  pressaoFiltradas: Pressao[] = [];
  user: User | undefined;
  userId: string | null = null;

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  constructor(
    private alertController: AlertController,
    private pressaoService: PressaoService,
    private userService: UserService,
    private route: ActivatedRoute,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(user => {
        this.user = user;
        if (this.user) {
          this.loadPressaoRecords(this.user.id);
        }
      });
    }
  }

  loadPressaoRecords(userId: string) {
    this.firestore
      .collection<Pressao>('pressao', ref => ref.where('userId', '==', userId))
      .valueChanges({ idField: 'id' })
      .subscribe((pressao) => {
        this.pressao = pressao;
        this.pressaoFiltradas = [...this.pressao];
      });
  }

  async adicionarNota() {
    const alert = await this.alertController.create({
      header: 'Adicione a Aferição da Pressão',
      inputs: [
        { name: 'sistole', type: 'text', placeholder: 'Digite o valor da sístole (min)...' },
        { name: 'diastole', type: 'text', placeholder: 'Digite o valor da diástole (max)...' },
        { name: 'data', type: 'date', placeholder: 'Selecione a data' },
        { name: 'hora', type: 'time', placeholder: 'Selecione a hora' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Salvar',
          handler: async (data) => {
            if (data.sistole && data.diastole && data.data && data.hora && this.userId) {
              const dataHora = new Date(`${data.data}T${data.hora}`);
              const novoRegistro: Pressao = {
                sistole: data.sistole,
                diastole: data.diastole,
                dataHora,
                userId: this.userId // Associa o ID do usuário ao registro
              };
              await this.pressaoService.adicionarPressao(novoRegistro);
              this.loadPressaoRecords(this.userId);
            } else {
              await this.presentAlert('Por favor, preencha todos os campos.');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async editarNota(nota: Pressao) {
    const dataHora = nota.dataHora instanceof firebase.firestore.Timestamp 
      ? nota.dataHora.toDate() 
      : nota.dataHora 
        ? new Date(nota.dataHora) 
        : null;
  
    const alert = await this.alertController.create({
      header: 'Editar Registro de Pressão',
      inputs: [
        { name: 'sistole', type: 'text', value: nota.sistole, placeholder: 'Digite o valor da sístole (max)...' },
        { name: 'diastole', type: 'text', value: nota.diastole, placeholder: 'Digite o valor da diástole (min)...' },
        { name: 'data', type: 'date', value: dataHora ? dataHora.toISOString().split('T')[0] : '', placeholder: 'Selecione a data' },
        { name: 'hora', type: 'time', value: dataHora ? dataHora.toISOString().split('T')[1].slice(0, 5) : '', placeholder: 'Selecione a hora' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Salvar',
          handler: async (data) => {
            if (data.sistole && data.diastole && data.data && data.hora && this.userId) {
              const dataHora = new Date(`${data.data}T${data.hora}`);
              const registroAtualizado: Pressao = {
                id: nota.id,
                sistole: data.sistole,
                diastole: data.diastole,
                dataHora,
                userId: this.userId! // Inclui o ID do usuário no registro
              };
              await this.pressaoService.editarPressao(registroAtualizado); // Chamada corrigida
              this.loadPressaoRecords(this.userId!);
            } else {
              await this.presentAlert('Por favor, preencha todos os campos.');
            }
          },
        },
      ],
    });
    await alert.present();
  }
  
  excluirNota(nota: Pressao) {
    if (nota.id) {
      this.pressaoService.excluirPressao(nota.id);
      this.loadPressaoRecords(this.userId!); // Garante que `userId` não seja nulo
    }
  }

  filtrarAnotacoes(event: any) {
    const pesquisa = event.target.value.toLowerCase();
    this.pressaoFiltradas = this.pressao.filter(nota => {
      const sistoleDiastole = `${nota.sistole} ${nota.diastole}`.toLowerCase();
      const dataHora = this.formatarDataHora(nota.dataHora).toLowerCase();
      return sistoleDiastole.includes(pesquisa) || dataHora.includes(pesquisa);
    });
  }

  async excluiNota(nota: Pressao) {
    if (!nota.id) return;
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Deseja excluir este registro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Excluir',
          handler: async () => {
            await this.pressaoService.excluirPressao(nota.id!);
            this.loadPressaoRecords(this.userId!);
          }
        }
      ]
    });
    await alert.present();
  }

  formatarDataHora(dataHora: Date | firebase.firestore.Timestamp): string {
    if (dataHora instanceof firebase.firestore.Timestamp) {
      return dataHora.toDate().toLocaleString();
    } else {
      return dataHora.toLocaleString();
    }
  }

  // Método para exibir alertas
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async gerarPDF() {
    const element = this.pdfContent.nativeElement;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    // Adiciona o título com o nome do usuário
    if (this.user?.nome) {
      pdf.text(`Registro de Pressão de ${this.user.nome}`, 10, 10);
    }
    
    // Adiciona a imagem da tabela renderizada
    pdf.addImage(imgData, 'PNG', 10, 20, 190, 0);
    pdf.save('pressao.pdf');
  }
}
