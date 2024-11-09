import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor() {
    this.inicializarNotificacoes();
  }

  async inicializarNotificacoes() {
    try {
      await LocalNotifications.requestPermissions();
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
    }
  }

  async agendarNotificacao(id: number, titulo: string, mensagem: string, horario: Date) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id,
            title: titulo,
            body: mensagem,
            schedule: { at: horario },
            sound: 'default',
            smallIcon: 'ic_notification',
          },
        ],
      });
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      throw error;
    }
  }

  async cancelarNotificacao(id: number) {
    await LocalNotifications.cancel({ notifications: [{ id }] });
  }
}
