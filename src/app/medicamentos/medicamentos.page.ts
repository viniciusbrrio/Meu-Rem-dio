//medicamentos.page.ts

import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AddMedicamentoModalPage } from '../add-medicamento-modal/add-medicamento-modal.page';
import { LocalNotifications } from '@capacitor/local-notifications';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { MedicamentoService } from '../services/medicamento.service';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Firebase Firestore
import { Observable } from 'rxjs';
import { NotificationsService } from '../services/notifications.service';
import { Medicamento } from '../interfaces/medicamento.interface';


@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.page.html',
  styleUrls: ['./medicamentos.page.scss'],
})
export class MedicamentosPage implements OnInit {
  medicamentos: Medicamento[] = [];
  user: User | undefined; // Usuário que será recuperado
  user$: Observable<User | undefined> | undefined; // Para uso com async pipe no template, se necessário

  constructor(
    private notificationsService: NotificationsService,
    private modalController: ModalController,
    private alertController: AlertController,
    private medicamentoService: MedicamentoService,
    private route: ActivatedRoute,
    private userService: UserService,
    private firestore: AngularFirestore // Injetar Firestore
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      // Substitui await por subscribe, já que getUserById retorna um Observable
      this.userService.getUserById(userId).subscribe(user => {
        this.user = user;  // Atribui o valor do Observable a 'this.user'
        if (this.user) {
          this.loadMedicamentos(this.user.id); // Carrega os medicamentos se o usuário estiver definido
        }
      });
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
        user: this.user, // Passa o usuário para o modal
      },
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data && this.user) {
        const medicamento = { ...result.data, userId: this.user.id };

        // Verificar se o medicamento já existe
        if (!this.medicamentoExiste(medicamento.nome)) {
          await this.medicamentoService.addMedicamento(medicamento); // Adiciona ao Firestore
          this.scheduleReminder(medicamento);  // Agenda o lembrete
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
            if (medicamento.id) {
              await this.medicamentoService.removeMedicamento(medicamento.id); // Passa o ID correto para exclusão
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // Agendar lembrete para tomar o medicamento
  async scheduleReminder(medicamento: Medicamento) {
    const horario = new Date(medicamento.horario); // Converte para Date
    if (!isNaN(horario.getTime())) { // Verifica se a data é válida
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
    } else {
      console.error('Horário inválido para o lembrete:', medicamento.horario);
    }
  }
}












