import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AddUserModalPage } from '../add-user-modal/add-user-modal.page'; // Modal que adiciona utilizador
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar Firestore para integração com o Firebase
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  users: User[] = []; // Lista de utilizadores

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private userService: UserService,
    private firestore: AngularFirestore,
    private router: Router // Injetar Router
  ) {}

  async ngOnInit() {
    // Carregar os utilizadores da base de dados Firebase ao iniciar a página
    this.loadUsers();
  }

  // Método para abrir o modal de adicionar utilizador
  async openAddUserModal() {
    const modal = await this.modalController.create({
      component: AddUserModalPage, // Modal onde o utilizador é adicionado
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        // O resultado contém os dados do novo utilizador
        const newUser: User = result.data;

        // Adicionar o novo utilizador ao Firebase
        const id = this.firestore.createId(); // Gerar ID único para o utilizador
        await this.firestore.collection('users').doc(id).set({ ...newUser, id });

        // Atualizar a lista de utilizadores localmente
        this.loadUsers(); // Recarregar a lista após adicionar o utilizador
      }
    });

    await modal.present();
  }

  // Carregar todos os utilizadores do Firebase
  loadUsers() {
    this.firestore
      .collection<User>('users')
      .valueChanges({ idField: 'id' }) // Recupera a lista de utilizadores, incluindo o ID do Firestore
      .subscribe((users) => {
        this.users = users; // Atualiza a lista local de utilizadores
      });
  }

  // Ir para o painel do utilizador
  goToUserPanel(user: User) {
    if (user && user.id) {
      this.router.navigate(['/painel', user.id]);
    } else {
      console.error('Usuário inválido ou ID ausente');
    }
  }

  // Confirmar exclusão do utilizador
  async confirmDeleteUser(user: User) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: `Deseja realmente excluir o utilizador ${user.nome}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Excluir',
          handler: async () => {
            await this.deleteUser(user); // Executar a exclusão
          },
        },
      ],
    });

    await alert.present();
  }

  // Excluir utilizador do Firebase
  async deleteUser(user: User) {
    await this.firestore.collection('users').doc(user.id).delete();
    this.loadUsers(); // Recarregar a lista de utilizadores após a exclusão
  }
}
