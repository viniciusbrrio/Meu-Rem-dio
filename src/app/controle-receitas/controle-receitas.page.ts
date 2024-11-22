import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ReceitaService } from '../services/receita.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Receita } from '../interfaces/receita.interface';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase-config';

@Component({
  selector: 'app-controle-receitas',
  templateUrl: './controle-receitas.page.html',
  styleUrls: ['./controle-receitas.page.scss'],
})
export class ControleReceitasPage implements OnInit {
  receitas: Receita[] = [];
  receitasFiltradas: Receita[] = [];
  user: User | undefined;
  userId: string | null = null;
  imagemUrl: string | null = null;

  constructor(
    private alertController: AlertController,
    private receitaService: ReceitaService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.loadUserAndReceitas(this.userId);
    }
  }

  private loadUserAndReceitas(userId: string) {
    this.userService.getUserById(userId).subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.loadReceitas(userId);
      }
    });
  }

  private loadReceitas(userId: string) {
    this.receitaService.getReceitasByUserId(userId).subscribe((receitas) => {
      this.receitas = receitas;
      this.receitasFiltradas = [...this.receitas];
    });
  }

  async adicionarReceita() {
    const alert = await this.alertController.create({
      header: 'Adicionar Receita',
      inputs: [
        {
          name: 'dataValidade',
          type: 'date',
          placeholder: 'Data de validade da receita',
        },
      ],
      buttons: [
        {
          text: 'Escolher Foto',
          handler: async () => {
            await this.escolherFoto();
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Salvar',
          handler: async (data) => {
            if (data.dataValidade && this.userId && this.imagemUrl) {
              const novaReceita: Receita = {
                imagemUrl: this.imagemUrl,
                dataValidade: new Date(data.dataValidade),
                userId: this.userId,
              };
              await this.receitaService.adicionarReceita(novaReceita);
              this.loadReceitas(this.userId);
            } else {
              this.presentAlert('Por favor, preencha todos os campos.');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async escolherFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      });

      if (image.dataUrl) {
        const fileName = `receitas/${new Date().getTime()}.jpeg`;
        const imageRef = ref(storage, fileName);

        // Faz o upload da imagem para o Firebase Storage
        await uploadString(imageRef, image.dataUrl, 'data_url');

        // Obtém a URL pública da imagem
        this.imagemUrl = await getDownloadURL(imageRef);

        console.log('Imagem salva com sucesso:', this.imagemUrl);
      }
    } catch (error) {
      console.error('Erro ao capturar ou salvar a foto', error);
      this.presentAlert('Não foi possível capturar ou salvar a foto.');
    }
  }

  async editarReceita(receita: Receita) {
    const alert = await this.alertController.create({
      header: 'Editar Receita',
      inputs: [
        {
          name: 'dataValidade',
          type: 'date',
          value: receita.dataValidade.toISOString().substring(0, 10),
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Salvar',
          handler: async (data) => {
            if (data.dataValidade) {
              const receitaAtualizada: Receita = {
                ...receita,
                dataValidade: new Date(data.dataValidade),
              };
              await this.receitaService.editarReceita(
                receita.id!,
                receitaAtualizada
              );
              this.loadReceitas(this.userId!);
            } else {
              this.presentAlert('Por favor, preencha todos os campos.');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async excluirReceita(receita: Receita) {
    if (!receita.id) return;

    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Deseja excluir esta receita?',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Excluir',
          handler: async () => {
            await this.receitaService.excluirReceita(receita.id!);
            this.loadReceitas(this.userId!);
          },
        },
      ],
    });
    await alert.present();
  }

  private async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString();
  }
}
