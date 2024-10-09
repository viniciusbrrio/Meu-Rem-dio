import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

interface Recipe {
  id?: string;
  image: string;
  validity: string;
  userId: string;
  createdAt: Date;
}

@Component({
  selector: 'app-receitas',
  templateUrl: './receitas.page.html',
  styleUrls: ['./receitas.page.scss'],
})
export class ReceitasPage implements OnInit {
  recipeImage: string = '';
  recipeValidity: string = '';
  recipes: Recipe[] = [];
  userId: string | null = null;

  constructor(
    private toastCtrl: ToastController,
    private router: Router,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.loadRecipes();
      }
    });
  }

  async uploadRecipe() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        allowEditing: false,
      });

      if (image.dataUrl) {
        this.recipeImage = image.dataUrl;
      } else {
        this.presentToast('Erro ao carregar a imagem.');
      }
    } catch (error) {
      this.presentToast('Erro ao carregar a receita.');
    }
  }

  async saveRecipe() {
    if (!this.userId) {
      this.presentToast('Usuário não autenticado.');
      return;
    }

    if (this.recipeImage && this.recipeValidity) {
      try {
        const newRecipe: Recipe = {
          image: this.recipeImage,
          validity: this.recipeValidity,
          userId: this.userId,
          createdAt: new Date(),
        };

        await this.firestore.collection('recipes').add(newRecipe);
        this.presentToast('Receita salva com sucesso!');
        this.clearFields();
        this.loadRecipes();
      } catch (error) {
        this.presentToast('Erro ao salvar a receita.');
      }
    } else {
      this.presentToast('Por favor, carregue uma receita e defina a validade.');
    }
  }

  async loadRecipes() {
    if (!this.userId) return;

    try {
      this.firestore
        .collection('recipes', (ref) =>
          ref.where('userId', '==', this.userId).orderBy('createdAt', 'desc')
        )
        .snapshotChanges()
        .subscribe((actions) => {
          this.recipes = actions.map((a) => {
            const data = a.payload.doc.data() as Recipe;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        });
    } catch (error) {
      this.presentToast('Erro ao carregar as receitas.');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  clearFields() {
    this.recipeImage = '';
    this.recipeValidity = '';
  }

  goToReceitas() {
    this.router.navigate(['/receitas']);
  }
}