//glicose.page.ts

import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GlicoseService } from '../services/glicose.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Glicose } from '../interfaces/glicose.interface';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-glicose',
  templateUrl: './glicose.page.html',
  styleUrls: ['./glicose.page.scss'],
})
export class GlicosePage implements OnInit {
  glicose: Glicose[] = [];
  glicoseFiltradas: Glicose[] = [];
  user: User | undefined;
  userId: string | null = null;

  constructor(
    private alertController: AlertController,
    private glicoseService: GlicoseService,
    private userService: UserService,
    private route: ActivatedRoute,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(user => {
        this.user = user;
        if (this.user) {
          this.loadGlicoseRecords(this.user.id);
        }
      });
    }
  }

  loadGlicoseRecords(userId: string) {
    this.firestore
      .collection<Glicose>('glicose', ref => ref.where('userId', '==', userId))
      .valueChanges({ idField: 'id' })
      .subscribe((glicose) => {
        this.glicose = glicose;
        this.glicoseFiltradas = [...this.glicose];
      });
  }

  async adicionarNota() {
    const alert = await this.alertController.create({
      header: 'Adicione a medição da Glicose',
      inputs: [
        {
          name: 'conteudo',
          type: 'text',
          placeholder: 'Digite o valor da glicose...',
        },
        {
          name: 'data',
          type: 'date',
        },
        {
          name: 'hora',
          type: 'time',
        }
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
            if (data.conteudo && data.data && data.hora && this.userId) {
              const dataHora = new Date(`${data.data}T${data.hora}`);
              const novoRegistro: Glicose = {
                conteudo: data.conteudo + ' mmHg',
                dataHora,
                userId: this.userId // Adiciona o ID do usuário
              };
              await this.glicoseService.adicionarGlicose(novoRegistro);
              this.loadGlicoseRecords(this.userId); // Atualiza a lista após adicionar
            } else {
              this.presentAlert('Por favor, preencha todos os campos.');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async editarNota(nota: Glicose) {
    const alert = await this.alertController.create({
      header: 'Editar Registro de Glicose',
      inputs: [
        {
          name: 'conteudo',
          type: 'text',
          placeholder: 'Digite o valor da glicose...',
          value: nota.conteudo,
        },
        {
          name: 'data',
          type: 'date',
          value: nota.dataHora,
        },
        {
          name: 'hora',
          type: 'time',
          value: nota.dataHora,
        }
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
            if (data.conteudo && data.data && data.hora) {
              const dataHora = new Date(`${data.data}T${data.hora}`);
              const atualizadoRegistro: Glicose = {
                conteudo: data.conteudo,
                dataHora,
                userId: this.userId! // Inclui userId
              };
              await this.glicoseService.editarGlicose(nota.id!, atualizadoRegistro);
              this.loadGlicoseRecords(this.userId!);
            } else {
              this.presentAlert('Por favor, preencha todos os campos.');
            }
          },
        },
      ],
    });

    await alert.present();
  }


  async excluirNota(nota: Glicose) {
    if (!nota.id) return;
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Deseja excluir este registro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Excluir',
          handler: async () => {
            this.glicoseService.excluirGlicose(nota.id!);
            this.loadGlicoseRecords(this.userId!);
          }
        }
      ]
    });
    await alert.present();
  }

  filtrarAnotacoes(event: any) {
    const pesquisa = event.target.value.toLowerCase();
    this.glicoseFiltradas = this.glicose.filter(nota => {
      const conteudoMatch = nota.conteudo.toLowerCase().includes(pesquisa);
      const dataHoraMatch = nota.dataHora.toLocaleString().toLowerCase().includes(pesquisa);
      return conteudoMatch || dataHoraMatch;
    });
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }  

  formatarDataHora(dataHora: Date | firebase.firestore.Timestamp): string {
    if (dataHora instanceof firebase.firestore.Timestamp) {
      return dataHora.toDate().toLocaleString();
    } else {
      return dataHora.toLocaleString();
    }
  }
}

