import { Component } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.page.html',
  styleUrls: ['./alertas.page.scss'],
})
export class AlertasPage {
  alertas: { id: number; horario: Date }[] = []; // Armazena o horário e ID de cada alerta

  constructor() {}

  // Método para adicionar um novo alerta com notificação
  async adicionarAlerta() {
    const horarioString = prompt("Digite o horário para o alerta (HH:MM)");

    // Validação do horário
    if (horarioString && /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(horarioString)) {
      const [hours, minutes] = horarioString.split(':').map(Number);
      const horario = new Date();
      horario.setHours(hours, minutes, 0);

      const alertaId = Date.now(); // Cria um ID único com base no timestamp
      const alerta = { id: alertaId, horario };

      // Adiciona o alerta à lista de alertas
      this.alertas.push(alerta);

      // Agendar a notificação local
      await LocalNotifications.schedule({
        notifications: [
          {
            id: alertaId, // ID único da notificação
            title: "Hora do Medicamento",
            body: "Lembre-se de tomar seu remédio.",
            schedule: { at: horario },
            sound: "beep.wav", // Certifique-se de que beep.wav está configurado corretamente
            smallIcon: "ic_launcher",
          },
        ],
      });
    } else {
      alert("Horário inválido. Por favor, insira no formato HH:MM.");
    }
  }

  // Método para remover um alerta e cancelar a notificação
  async removerAlerta(alerta: { id: number; horario: Date }) {
    // Remove o alerta da lista
    this.alertas = this.alertas.filter(a => a.id !== alerta.id);

    // Cancela a notificação associada ao alerta
    await LocalNotifications.cancel({ notifications: [{ id: alerta.id }] });
  }
}
