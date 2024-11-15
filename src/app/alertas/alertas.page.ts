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
  diasSemana: { [key: string]: boolean }; // Alterado para um objeto
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

  getDiasSelecionados(alerta: Alerta): string[] {
    return Object.keys(alerta.diasSemana)
      .filter(dia => alerta.diasSemana[dia]); // Retorna apenas os dias que foram selecionados
  }
  

  async removerAlerta(alerta: Alerta) {
    this.alertas = this.alertas.filter(a => a.id !== alerta.id);
    await this.salvarAlertas();
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
