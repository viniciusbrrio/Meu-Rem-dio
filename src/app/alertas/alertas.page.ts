import { Component, OnInit } from '@angular/core';
import { AlertController, AlertInput } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';
import { ActivatedRoute } from '@angular/router';
import { MedicamentoService } from '../services/medicamento.service';

interface Alerta {
  id: number;
  horario: Date;
  medicamentoId: string;
  nomeMedicamento: string;
  diasSemana: { [key: string]: boolean };
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
  diasDaSemana: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  constructor(
    private medicamentoService: MedicamentoService,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.medicamentoId = this.route.snapshot.paramMap.get('id')!;
    if (this.medicamentoId) {
      const medicamento = await this.medicamentoService.getMedicamentoById(this.medicamentoId);
      this.nomeMedicamento = medicamento?.nome || '';
      await this.carregarAlertas();
    }
  }

  async carregarAlertas() {
    const { value } = await Preferences.get({ key: `alertas-${this.medicamentoId}` });
    if (value) {
      this.alertas = JSON.parse(value);
      this.alertas.forEach(alerta => {
        alerta.horario = new Date(alerta.horario);
      });
    }
  }

  async salvarAlertas() {
    await Preferences.set({
      key: `alertas-${this.medicamentoId}`,
      value: JSON.stringify(this.alertas),
    });
  }

  async adicionarAlerta() {
    const inputs: AlertInput[] = [
      { name: 'hora', type: 'time', placeholder: 'Escolha o horário' },
      { name: 'medicamento', type: 'text', placeholder: 'Nome do medicamento', value: this.nomeMedicamento },
      { type: 'textarea', cssClass: 'separator', placeholder: 'Dias da semana', disabled: true },
      ...this.diasDaSemana.map((dia): AlertInput => ({
        name: `dia-${dia}`,
        type: 'checkbox',
        label: dia,
        value: dia,
        checked: false,
      }))
    ];
    
    const alert = await this.alertController.create({
      header: 'Defina o horário do alerta',
      inputs,
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Adicionar',
          handler: async (data) => {
            const horarioString = data.hora;
            const nomeMedicamento = data.medicamento;

            if (horarioString && /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(horarioString)) {
              const [hours, minutes] = horarioString.split(':').map(Number);
              const horario = new Date();
              horario.setHours(hours, minutes, 0, 0);

              // Obter os dias selecionados em um objeto
              const diasSemana = this.diasDaSemana.reduce((acc, dia) => {
                acc[dia] = !!data[`dia-${dia}`];
                return acc;
              }, {} as { [key: string]: boolean });

              // Verificar se pelo menos um dia foi selecionado
              if (!Object.values(diasSemana).some(valor => valor)) {
                await this.showAlert('Erro', 'Selecione pelo menos um dia da semana.');
                return false;
              }

              const alertaId = Date.now();
              const alerta: Alerta = { id: alertaId, horario, medicamentoId: this.medicamentoId, nomeMedicamento, diasSemana };

              this.alertas.push(alerta);
              await this.salvarAlertas();
              await this.agendarNotificacao(alerta);
              return true;
            } else {
              await this.showAlert('Erro', 'Horário inválido. Por favor, insira no formato HH:MM.');
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async agendarNotificacao(alerta: Alerta) {
    await LocalNotifications.requestPermissions();

    // Agendar notificações para os dias da semana selecionados
    for (const [dia, ativo] of Object.entries(alerta.diasSemana)) {
      if (ativo) {
        const diaIndex = this.diasDaSemana.indexOf(dia);
        const agora = new Date();
        const horario = new Date(alerta.horario);
        let proximaData = new Date();

        proximaData.setHours(horario.getHours(), horario.getMinutes(), 0, 0);
        proximaData.setDate(
          agora.getDate() + ((diaIndex - agora.getDay() + 7) % 7)
        );

        // Garantir que não agende para o passado
        if (proximaData < agora) {
          proximaData.setDate(proximaData.getDate() + 7);
        }

        await LocalNotifications.schedule({
          notifications: [
            {
              id: alerta.id + diaIndex, // ID único por dia
              title: `Hora de tomar ${alerta.nomeMedicamento}`,
              body: `Lembre-se de tomar seu medicamento: ${alerta.nomeMedicamento}`,
              schedule: { at: proximaData, repeats: true, every: 'week' },
              smallIcon: 'ic_stat_icon',
            }
          ]
        });
      }
    }
  }

  getDiasSelecionados(alerta: Alerta): string[] {
    return Object.keys(alerta.diasSemana)
      .filter(dia => alerta.diasSemana[dia]); // Retorna apenas os dias que foram selecionados
  }

  async removerAlerta(alerta: Alerta) {
    this.alertas = this.alertas.filter(a => a.id !== alerta.id);
    await this.salvarAlertas();

    // Cancelar notificações
    const ids = Object.keys(alerta.diasSemana)
      .map((dia, index) => alerta.id + index);
    await LocalNotifications.cancel({ notifications: ids.map(id => ({ id })) });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}

