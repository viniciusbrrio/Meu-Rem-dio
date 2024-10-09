import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';

interface UserProfile {
  nome: string;
  sobrenome: string;
  email: string;
  senha: string; // Note: It's not recommended to store passwords in plaintext
  dataNascimento: string;
  bairro: string;
  estado: string;
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
    email: '',
    senha: '',
    dataNascimento: '',
    bairro: '',
    estado: ''
  };

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const user = await this.auth.currentUser;
    if (user) {
      this.firestore.collection('users').doc(user.uid).get().subscribe(
        (doc) => {
          if (doc.exists) {
            const data = doc.data() as UserProfile;
            this.userProfile = {
              nome: data.nome || '',
              sobrenome: data.sobrenome || '',
              email: data.email || '',
              senha: data.senha || '', // Again, not recommended to store or display passwords
              dataNascimento: data.dataNascimento || '',
              bairro: data.bairro || '',
              estado: data.estado || ''
            };
          }
        },
        (error) => {
          console.error('Error loading user profile:', error);
          this.presentToast('Erro ao carregar o perfil do usuário.');
        }
      );
    }
  }

  async saveProfile() {
    const user = await this.auth.currentUser;
    if (user) {
      this.firestore.collection('users').doc(user.uid).set(this.userProfile)
        .then(() => {
          this.presentToast('Perfil atualizado com sucesso!');
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
          this.presentToast('Erro ao atualizar o perfil.');
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
