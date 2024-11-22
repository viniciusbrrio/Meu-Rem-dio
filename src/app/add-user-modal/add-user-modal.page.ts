import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model'; 

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.page.html',
  styleUrls: ['./add-user-modal.page.scss'],
})
export class AddUserModalPage implements OnInit {
  userForm: FormGroup = this.formBuilder.group({}); 

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore 
  ) {}

  ngOnInit() {
    
    this.userForm = this.formBuilder.group({
      nome: ['', Validators.required],
      idade: ['', [Validators.required, Validators.min(1)]],
    });
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async addUser() {
    if (this.userForm.valid) {
      const userData: User = this.userForm.value; 
      const id = this.firestore.createId(); 

      try {
        /* Adicionar o utilizador à coleção "users" no Firestore
        await this.firestore.collection('users').doc(id).set({ ...userData, id });*/
        
        await this.modalController.dismiss(userData); 
      } catch (error) {
        console.error('Erro ao adicionar utilizador ao Firebase:', error);
      }
    }
  }
}




