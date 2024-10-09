import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar AngularFirestore
import { User } from '../models/user.model'; // Modelo de utilizador

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.page.html',
  styleUrls: ['./add-user-modal.page.scss'],
})
export class AddUserModalPage implements OnInit {
  userForm: FormGroup = this.formBuilder.group({}); // Inicializando corretamente

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore // Injetar o Firestore
  ) {}

  ngOnInit() {
    // Configuração do formulário com validação
    this.userForm = this.formBuilder.group({
      nome: ['', Validators.required],
      idade: ['', [Validators.required, Validators.min(1)]],
    });
  }

  // Fechar o modal sem enviar dados
  dismissModal() {
    this.modalController.dismiss();
  }

  // Adicionar o utilizador ao Firebase e fechar o modal
  async addUser() {
    if (this.userForm.valid) {
      const userData: User = this.userForm.value; // Pega os dados do formulário
      const id = this.firestore.createId(); // Gera um ID único para o utilizador

      try {
        // Adicionar o utilizador à coleção "users" no Firestore
        await this.firestore.collection('users').doc(id).set({ ...userData, id });

        // Fechar o modal e enviar os dados de volta sem sobrescrever o campo id
        await this.modalController.dismiss(userData); // Agora apenas userData será enviado, sem duplicação de 'id'
      } catch (error) {
        console.error('Erro ao adicionar utilizador ao Firebase:', error);
      }
    }
  }
}




