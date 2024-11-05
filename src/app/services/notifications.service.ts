import { Injectable } from '@angular/core';
import { LocalNotifications, ScheduleOptions, PendingResult } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor() {
    this.inicializarNotificacoes();
  }

  async inicializarNotificacoes() {
    try {
      // Solicitar permissões ao iniciar
      await LocalNotifications.requestPermissions();
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
    }
  }

  async agendarNotificacao(titulo: string, mensagem: string, horario: Date) {
    try {
      const notificationId = new Date().getTime(); // Gera ID único

      await LocalNotifications.schedule({
        notifications: [
          {
            id: notificationId,
            title: titulo,
            body: mensagem,
            schedule: { at: horario },
            sound: 'default',
            smallIcon: 'ic_notification', // Ícone para Android
            actionTypeId: 'TOMAR_MEDICAMENTO',
            extra: {
              timestamp: horario.getTime()
            }
          }
        ]
      });

      return notificationId;
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      throw error;
    }
  }

  async listarNotificacoesPendentes(): Promise<PendingResult> {
    return await LocalNotifications.getPending();
  }

  async cancelarNotificacao(id: number) {
    await LocalNotifications.cancel({ notifications: [{ id }] });
  }

  async cancelarTodasNotificacoes() {
    const pendentes = await this.listarNotificacoesPendentes();
    if (pendentes.notifications.length > 0) {
      await LocalNotifications.cancel({
        notifications: pendentes.notifications
      });
    }
  }
}
