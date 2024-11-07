import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { AddMedicamentoModalPage } from '../add-medicamento-modal/add-medicamento-modal.page';
import { LocalNotifications } from '@capacitor/local-notifications';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { MedicamentoService } from '../services/medicamento.service';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Firebase Firestore
import { Observable } from 'rxjs';
import { Medicamento } from '../interfaces/medicamento.interface';

@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.page.html',
  styleUrls: ['./medicamentos.page.scss'],
})
export class MedicamentosPage implements OnInit {
  medicamentos: Medicamento[] = [];
  user: User | undefined;
  user$: Observable<User | undefined> | undefined;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private medicamentoService: MedicamentoService,
    private route: ActivatedRoute,
    private userService: UserService,
    private firestore: AngularFirestore,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(userId).subscribe(user => {
        this.user = user;
        if (this.user) {
          this.loadMedicamentos(this.user.id);
        }
      });
    }
  }

  // Carregar medicamentos do Firestore com tratamento de erro
  loadMedicamentos(userId: string) {
    this.firestore
      .collection<Medicamento>('medicamentos', ref => ref.where('userId', '==', userId))
      .valueChanges({ idField: 'id' })
      .subscribe(
        (medicamentos) => {
          this.medicamentos = medicamentos;
        },
        (error) => {
          console.error('Erro ao carregar medicamentos:', error);
        }
      );
  }

  // Abrir modal para adicionar novo medicamento
  async openAddMedicamentoModal() {
    const modal = await this.modalController.create({
      component: AddMedicamentoModalPage,
      componentProps: {
        user: this.user,
      },
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data && this.user) {
        const medicamento = { ...result.data, userId: this.user.id };

        // Verificar se o medicamento já existe
        if (!this.medicamentoExiste(medicamento.nome)) {
          await this.medicamentoService.addMedicamento(medicamento);
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
            try {
              if (medicamento.id) {
                // Cancela a notificação associada ao medicamento
                if (medicamento.notificationId) {
                  await LocalNotifications.cancel({ notifications: [{ id: medicamento.notificationId }] });
                }
                await this.medicamentoService.removeMedicamento(medicamento.id);
                console.log('Medicamento excluído com sucesso');
              }
            } catch (error) {
              console.error('Erro ao excluir medicamento:', error);
              this.showErrorAlert('Erro ao excluir medicamento');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // Exibir alertas de erro
  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Erro',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Navegar para a página de alertas do medicamento
  irParaAlertas(medicamento: Medicamento) {
    this.navCtrl.navigateForward(`/alertas/:id`);
  }

  // Agendar lembrete para tomar o medicamento
  async scheduleReminder(medicamento: Medicamento) {
    const horario = new Date(medicamento.horario);
    if (!isNaN(horario.getTime())) {
      const notificationId = parseInt(medicamento.id!, 10) + Date.now(); // Usa o "!" para indicar que id não é undefined

      await LocalNotifications.schedule({
        notifications: [
          {
            id: notificationId,
            title: `Hora de tomar o medicamento: ${medicamento.nome}`,
            body: `Tipo: ${medicamento.tipo}, Dosagem: ${medicamento.dosagem}`,
            schedule: { at: horario },
            sound: "assets/sounds/beep.wav", // Definir caminho do som
            smallIcon: "ic_launcher",
          },
        ],
      });

      // Salvar o ID da notificação no medicamento
      if (medicamento.id) {
        medicamento.notificationId = notificationId;
        await this.medicamentoService.updateMedicamento(medicamento.id, { notificationId });
      } else {
        console.error("Erro: o ID do medicamento está indefinido.");
      }
    } else {
      console.error('Horário inválido para o lembrete:', medicamento.horario);
    }
  }
}














