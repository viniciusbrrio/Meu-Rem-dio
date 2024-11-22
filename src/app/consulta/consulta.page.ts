import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { ConsultaService } from '../services/consulta.service';
import { User } from '../models/user.model';
import { Consulta } from '../interfaces/consulta.interface';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Plugins } from '@capacitor/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
})
export class ConsultaPage implements OnInit {
  consulta: Consulta = {
    titulo: '',
    medico: '',
    dataHora: '',
    localizacao: '',
    observacoes: '',
    userId: '' 
  };

  consultasList: Consulta[] = [];
  user: User | undefined;
  isModalOpen = false;

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  constructor(
    private firestore: AngularFirestore,
    private alertController: AlertController,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private userService: UserService,
    private consultaService: ConsultaService
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(userId).subscribe(user => {
        this.user = user;
        if (this.user) {
          this.loadConsultas(this.user.id); // Carrega as consultas do usuário
        }
      });
    }
  }

  // Carrega as consultas do Firestore associadas ao usuário logado
  loadConsultas(userId: string) {
    this.firestore
      .collection<Consulta>('consultas', ref => ref.where('userId', '==', userId))
      .valueChanges({ idField: 'id' }) // Inclui o ID do documento Firestore
      .subscribe(consultas => {
        this.consultasList = consultas;
      });
  }

  openModal() {
    this.isModalOpen = true;
  }

  async salvarConsulta() {
    if (this.user) {
      const novaConsulta: Consulta = {
        ...this.consulta,
        userId: this.user.id, // Associa o ID do usuário
      };
  
      try {
        const docRef = await this.firestore.collection('consultas').add(novaConsulta);
        console.log('Consulta salva com sucesso!', docRef.id);
        this.consultasList.push({ id: docRef.id, ...novaConsulta });
        this.isModalOpen = false; // Fecha o modal após salvar
        this.limparFormulario(); // Limpa o formulário
  
        // Agendar a notificação
        await this.agendarNotificacao(novaConsulta);
      } catch (error) {
        console.error('Erro ao salvar a consulta:', error);
      }
    }
  }

  async gerarPDF() {
    try {
      const element = this.pdfContent.nativeElement;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
  
      const canvas = await html2canvas(element, {scale: 1.5});
  
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
  
      const imgWidth = 190;
      const imgHeight = canvas.height * (imgWidth / canvas.width);
  
      if (this.user?.nome) {
        pdf.setFontSize(12);
        pdf.text(`Registro de Consultas de ${this.user.nome}`, 10, 10);
      }
  
      pdf.addImage(imgData, 'JPEG', 10, 20, imgWidth, imgHeight);
      pdf.save('consultas.pdf');
  
      const pdfBlob = pdf.output('blob');
      const pdfBase64 = await this.blobToBase64(pdfBlob);
  
      await Filesystem.writeFile({
        path: 'consultas.pdf',
        data: pdfBase64,
        directory: Directory.Documents
      });
  
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  }
  
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }


  limparFormulario() {
    this.consulta = {
      titulo: '',
      medico: '',
      dataHora: '',
      localizacao: '',
      observacoes: '',
      userId: this.user?.id || ''
    };
  }

  async cancelarTarefa(consulta: Consulta) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: `Deseja realmente excluir a consulta ${consulta.titulo}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Excluir',
          handler: async () => {
            if (consulta.id) {
              await this.consultaService.removeConsulta(consulta.id); 
            }
          },
        },
      ],
    });

    await alert.present();
  }


async agendarNotificacao(consulta: Consulta) {
  try {
    // Data e hora da consulta
    const dataHoraConsulta = new Date(consulta.dataHora);
    const tresHorasAntes = new Date(dataHoraConsulta.getTime() - 3 * 60 * 60 * 1000);

    // Solicitar permissões (apenas na primeira vez)
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display === 'denied') {
      console.error('Permissões para notificações negadas.');
      return;
    }

    // Agendar a notificação
    await LocalNotifications.schedule({
      notifications: [
        {
          id: dataHoraConsulta.getTime(),
          title: `Lembrete: ${consulta.titulo}`,
          body: `Você tem uma consulta com ${consulta.medico} às ${dataHoraConsulta.toLocaleTimeString()} no local: ${consulta.localizacao}.`,
          schedule: { at: tresHorasAntes },
          extra: {
            medico: consulta.medico,
            dataHora: consulta.dataHora,
            localizacao: consulta.localizacao,
            observacoes: consulta.observacoes,
          },
          sound: 'beep.wav',
          smallIcon: 'ic_stat_icon', 
          largeIcon: 'ic_launcher', 
        },
      ],
    });

    console.log('Notificação agendada com sucesso!');
  } catch (error) {
    console.error('Erro ao agendar notificação:', error);
  }
}
}



