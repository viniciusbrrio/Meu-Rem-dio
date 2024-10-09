import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AddMedicamentoModalPage } from '../add-medicamento-modal/add-medicamento-modal.page';
import { LocalNotifications } from '@capacitor/local-notifications';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { MedicamentoService } from '../services/medicamento.service';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Firebase Firestore
import { firstValueFrom } from 'rxjs';

interface Medicamento {
  id?: string; // Adicionar ID opcional para uso no Firestore
  nome: string;
  tipo: string;
  dosagem: string;
  qnt: number;
  dias: number;
  horario: string;
  userId: string;
}

@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.page.html',
  styleUrls: ['./medicamentos.page.scss'],
})
export class MedicamentosPage implements OnInit {
  medicamentos: Medicamento[] = [];
  user: User | undefined;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private medicamentoService: MedicamentoService,
    private route: ActivatedRoute,
    private userService: UserService,
    private firestore: AngularFirestore // Injetar Firestore
  ) {}

  async ngOnInit() {
    // Obtenha o userId da rota ou de outra fonte
    const userId = this.route.snapshot.paramMap.get('id') || 'id-do-utilizador';

    // Carrega o utilizador a partir do Firebase
    this.user = await firstValueFrom(this.userService.getUserById(userId));

    if (this.user) {
      // Carrega os medicamentos do utilizador
      this.loadMedicamentos(this.user.id);
    }
  }

  // Carregar medicamentos do Firestore
  loadMedicamentos(userId: string) {
    this.firestore
      .collection<Medicamento>('medicamentos', ref => ref.where('userId', '==', userId))
      .valueChanges({ idField: 'id' }) // Recupera o ID do documento no Firestore
      .subscribe((medicamentos) => {
        this.medicamentos = medicamentos;
      });
  }

  // Abrir modal para adicionar novo medicamento
  async openAddMedicamentoModal() {
    const modal = await this.modalController.create({
      component: AddMedicamentoModalPage,
      componentProps: {
        user: this.user, // Passa o utilizador para o modal
      },
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data && this.user) {
        const medicamento = { ...result.data, userId: this.user.id };

        // Verificar se o medicamento já existe
        if (!this.medicamentoExiste(medicamento.nome)) {
          // Adiciona ao Firestore
          await this.medicamentoService.addMedicamento(medicamento);
          // Agenda o lembrete
          this.scheduleReminder(medicamento);
        }
      }
    });

    await modal.present();
  }

  // Verificar se o medicamento já existe
  medicamentoExiste(nome: string): boolean {
    return this.medicamentos.some(med => med.nome === nome && med.userId === this.user?.id);
  }

  // Excluir medicamento com confirmação
  async cancelarTarefa(medicamento: Medicamento) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: `Deseja realmente excluir o medicamento ${medicamento.nome}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Excluir',
          handler: async () => {
            if (this.user) {
              await this.medicamentoService.removeMedicamento(medicamento.nome, this.user.id);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // Agendar lembrete para tomar o medicamento
  async scheduleReminder(medicamento: Medicamento) {
    // Tentar converter o horário em objeto Date se necessário
    const horario = new Date(medicamento.horario);

    // Verifique se a data é válida antes de agendar a notificação
    if (isNaN(horario.getTime())) {
      console.error('Horário inválido para o medicamento', medicamento.nome);
      return;
    }

    // Agenda a notificação local
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Date.now(),
          title: `Hora de tomar o medicamento: ${medicamento.nome}`,
          body: `Tipo: ${medicamento.tipo}, Dosagem: ${medicamento.dosagem}`,
          schedule: { at: horario },
          sound: undefined,
        },
      ],
    });
  }
}











