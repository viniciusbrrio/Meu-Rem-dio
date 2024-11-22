import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AddUserModalPage } from '../add-user-modal/add-user-modal.page';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  users: User[] = [];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private userService: UserService,
    private firestore: AngularFirestore,
    private storage: Storage,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.loadUsers();
  }

  
  async openAddUserModal() {
    const modal = await this.modalController.create({
      component: AddUserModalPage,
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        const newUser: User = result.data;
        const id = this.firestore.createId();
        await this.firestore.collection('users').doc(id).set({ ...newUser, id });
        this.loadUsers();
      }
    });

    await modal.present();
  }

  loadUsers() {
    this.firestore
      .collection<User>('users')
      .valueChanges({ idField: 'id' })
      .subscribe((users) => {
        this.users = users;
      });
  }

  
  goToUserPanel(user: User) {
    if (user && user.id) {
      this.router.navigate(['/painel', user.id]);
    } else {
      console.error('Usuário inválido ou ID ausente');
    }
  }

  
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
            await this.deleteUser(user);
          },
        },
      ],
    });

    await alert.present();
  }

  
  async deleteUser(user: User) {
    await this.firestore.collection('users').doc(user.id).delete();
    this.loadUsers();
  }

 
  async logout() {
    try{
    await this.afAuth.signOut();
    await this.storage.clear();
    this.router.navigate(['/login']);
    }catch (error){
      console.error('Erro ao fazer logout.',error);
  }
}
}