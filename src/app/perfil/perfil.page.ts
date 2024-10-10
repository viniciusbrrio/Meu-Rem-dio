import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';

interface UserProfile {
  nome: string;
  sobrenome: string;
  email: string;
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

  // Carrega os dados do perfil a partir da coleção "cadastro"
  async loadUserProfile() {
    const user = await this.auth.currentUser;
    if (user) {
      // Agora estamos a buscar os dados na coleção "cadastro"
      this.firestore.collection('cadastro').doc(user.uid).get().subscribe(
        (doc) => {
          if (doc.exists) {
            const data = doc.data() as UserProfile;
            this.userProfile = {
              nome: data.nome || '',
              sobrenome: data.sobrenome || '',
              email: data.email || '',
              dataNascimento: data.dataNascimento || '',
              bairro: data.bairro || '',
              estado: data.estado || ''
            };
          }
        },
        (error) => {
          console.error('Erro ao carregar o perfil do usuário:', error);
          this.presentToast('Erro ao carregar o perfil do usuário.');
        }
      );
    }
  }

  // Salva as alterações no perfil de utilizador na coleção "cadastro"
  async saveProfile() {
    const user = await this.auth.currentUser;
    if (user) {
      this.firestore.collection('cadastro').doc(user.uid).set(this.userProfile)
        .then(() => {
          this.presentToast('Perfil atualizado com sucesso!');
        })
        .catch((error) => {
          console.error('Erro ao atualizar o perfil:', error);
          this.presentToast('Erro ao atualizar o perfil.');
        });
    }
  }

  // Exibe um toast com mensagens de sucesso ou erro
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}

