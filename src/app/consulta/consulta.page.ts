import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { ConsultaService } from '../services/consulta.service';
import { User } from '../models/user.model';
import { Consulta } from '../interfaces/consulta.interface';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
})
export class ConsultaPage implements OnInit {
  consulta: Consulta = {
    titulo: '',
    medico: '',
    dataHora: '',
    localizacao: '',
    observacoes: '',
    userId: '' // ID do usuário associado à consulta
  };

  consultasList: Consulta[] = []; // Lista de consultas
  user: User | undefined; // Usuário logado
  isModalOpen = false;

  constructor(
    private firestore: AngularFirestore,
    private alertController: AlertController,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private userService: UserService,
    private consultaService: ConsultaService
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(userId).subscribe(user => {
        this.user = user;
        if (this.user) {
          this.loadConsultas(this.user.id); // Carrega as consultas do usuário
        }
      });
    }
  }

  // Carrega as consultas do Firestore associadas ao usuário logado
  loadConsultas(userId: string) {
    this.firestore
      .collection<Consulta>('consultas', ref => ref.where('userId', '==', userId))
      .valueChanges({ idField: 'id' }) // Inclui o ID do documento Firestore
      .subscribe(consultas => {
        this.consultasList = consultas;
      });
  }

  openModal() {
    this.isModalOpen = true;
  }

  async salvarConsulta() {
    if (this.user) {
      const novaConsulta: Consulta = {
        ...this.consulta,
        userId: this.user.id, // Associa o ID do usuário
      };

      try {
        const docRef = await this.firestore.collection('consultas').add(novaConsulta);
        console.log('Consulta salva com sucesso!', docRef.id);
        this.consultasList.push({ id: docRef.id, ...novaConsulta });
        this.isModalOpen = false; // Fecha o modal após salvar
        this.limparFormulario(); // Limpa o formulário
      } catch (error) {
        console.error('Erro ao salvar a consulta:', error);
      }
    }
  }

  limparFormulario() {
    this.consulta = {
      titulo: '',
      medico: '',
      dataHora: '',
      localizacao: '',
      observacoes: '',
      userId: this.user?.id || ''
    };
  }

  async cancelarTarefa(consulta: Consulta) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: `Deseja realmente excluir a consulta "${consulta.titulo}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Excluir',
          handler: async () => {
            if (consulta.id) {
              await this.consultaService.removeConsulta(consulta.id); // Passa o ID correto para exclusão
            }
          },
        },
      ],
    });

    await alert.present();
  }

}



