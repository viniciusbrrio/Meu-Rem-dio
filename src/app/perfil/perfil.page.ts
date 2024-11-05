import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../services/perfil.service';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';


interface UserProfile {
  nome: string;
  sobrenome: string;
  dataNascimento: string;
  estado: string;
  bairro: string;
  email: string;
  userId: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  userProfile: UserProfile = {
    nome: '',
    sobrenome: '',
    dataNascimento: '',
    bairro: '',
    estado: '',
    email: '',
    userId: ''
  };

  constructor(
    private perfilService: PerfilService,
    private auth: AngularFireAuth,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const user = await this.auth.currentUser;
    if (user) {
      this.perfilService.getUserProfile(user.uid).subscribe(
        (profile) => {
          this.userProfile = profile;
        },
        (error) => {
          console.error('Erro ao carregar perfil:', error);
          this.presentToast('Erro ao carregar perfil.');
        }
      );
    }
  }

  async saveProfile() {
    const user = await this.auth.currentUser;
    if (user) {
      this.perfilService.updateUserProfile(user.uid, this.userProfile)
        .then(() => {
          this.presentToast('Perfil atualizado com sucesso!');
        })
        .catch((error) => {
          console.error('Erro ao atualizar perfil:', error);
          this.presentToast('Erro ao atualizar perfil.');
        });
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}

