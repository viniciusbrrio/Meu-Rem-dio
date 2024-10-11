import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-glicose',
  templateUrl: './glicose.page.html',
  styleUrls: ['./glicose.page.scss'],
})
export class GlicosePage {
  glicose = {
    dataHora: '',
    nivel: null
  };

  constructor(private alertController: AlertController) {}

  async salvarGlicose() {
    if (!this.glicose.dataHora || this.glicose.nivel == null) {
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Por favor, preencha todos os campos.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Aqui você pode adicionar a lógica para salvar os dados, 
    // como enviar para um serviço ou armazenar localmente.

    // Limpa os campos após salvar
    this.glicose = { dataHora: '', nivel: null };

    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: 'Medição de glicose salva com sucesso!',
      buttons: ['OK']
    });
    await alert.present();
  }
}
