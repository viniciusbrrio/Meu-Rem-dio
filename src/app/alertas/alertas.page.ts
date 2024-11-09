import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';
import { ActivatedRoute } from '@angular/router';
import { MedicamentoService } from '../services/medicamento.service';

interface Alerta {
  id: number;
  horario: Date;
  medicamentoId: string;
  nomeMedicamento: string;
}

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.page.html',
  styleUrls: ['./alertas.page.scss'],
})
export class AlertasPage implements OnInit {
  alertas: Alerta[] = [];
  medicamentoId: string = '';
  nomeMedicamento: string = '';

  constructor(
    private medicamentoService: MedicamentoService,
    private route: ActivatedRoute,
    private alertController: AlertController  // Adicionando o AlertController
  ) {}

  async ngOnInit() {
    // Obter o ID do medicamento da URL
    this.medicamentoId = this.route.snapshot.paramMap.get('id')!;
    if (this.medicamentoId) {
      const medicamento = await this.medicamentoService.getMedicamentoById(this.medicamentoId);
      this.nomeMedicamento = medicamento?.nome || '';
      await this.carregarAlertas();
    }
  }

  // Carregar alertas específicos para o medicamento
  async carregarAlertas() {
    const { value } = await Preferences.get({ key: `alertas-${this.medicamentoId}` });
    this.alertas = value ? JSON.parse(value) : [];
    this.alertas.forEach(alerta => this.agendarNotificacao(alerta));
  }

  // Salvar alertas específicos para o medicamento
  async salvarAlertas() {
    await Preferences.set({
      key: `alertas-${this.medicamentoId}`,
      value: JSON.stringify(this.alertas),
    });
  }

  // Adicionar um novo alerta
  async adicionarAlerta() {
    const alert = await this.alertController.create({
      header: 'Defina o horário do alerta',
      inputs: [
        {
          name: 'hora',
          type: 'time',
          placeholder: 'Escolha o horário',
        },
        {
          name: 'medicamento',
          type: 'text',
          placeholder: 'Nome do medicamento',
          value: this.nomeMedicamento,  // Preenchendo automaticamente o nome do medicamento
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Adicionar',
          handler: async (data) => {
            const horarioString = data.hora;
            const nomeMedicamento = data.medicamento;

            // Validando o formato do horário
            if (horarioString && /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(horarioString)) {
              const [hours, minutes] = horarioString.split(':').map(Number);
              const horario = new Date();
              horario.setHours(hours, minutes, 0);

              const alertaId = Date.now();  // Cria um ID único baseado no timestamp
              const alerta: Alerta = {
                id: alertaId,
                horario,
                medicamentoId: this.medicamentoId,
                nomeMedicamento: nomeMedicamento,
              };

              // Adiciona à lista de alertas e salva
              this.alertas.push(alerta);
              await this.salvarAlertas();
              await this.agendarNotificacao(alerta);
            } else {
              // Exibe um alerta de erro usando o AlertController
              const erroAlert = await this.alertController.create({
                header: 'Erro',
                message: 'Horário inválido. Por favor, insira no formato HH:MM.',
                buttons: ['OK'],
              });
              await erroAlert.present();
            }
          },
        }
      ]
    });

    await alert.present();
  }

  // Agendar notificação local
  async agendarNotificacao(alerta: Alerta) {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: alerta.id,
          title: `Lembrete: ${alerta.nomeMedicamento}`,
          body: 'Está na hora de tomar seu medicamento.',
          schedule: { at: alerta.horario },
          sound: 'default',
          smallIcon: 'ic_launcher',
        },
      ],
    });
  }

  // Remover alerta
  async removerAlerta(alerta: Alerta) {
    this.alertas = this.alertas.filter(a => a.id !== alerta.id);
    await this.salvarAlertas();
    await LocalNotifications.cancel({ notifications: [{ id: alerta.id }] });
  }
}
