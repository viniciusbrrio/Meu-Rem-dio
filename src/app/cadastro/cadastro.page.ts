import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Firebase Auth
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Firestore

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  registerForm!: FormGroup;
  passwordsDoNotMatch = false;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private alertController: AlertController,
    private afAuth: AngularFireAuth, // Injeção do Firebase Auth
    private firestore: AngularFirestore // Injeção do Firestore
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    });

    // Validação personalizada para verificar se as senhas coincidem
    this.registerForm.valueChanges.subscribe(() => {
      const senha = this.registerForm.get('senha')?.value;
      const confirmarSenha = this.registerForm.get('confirmarSenha')?.value;
      this.passwordsDoNotMatch = senha !== confirmarSenha;
    });
  }

  async onRegister() {
    if (this.registerForm.valid && !this.passwordsDoNotMatch) {
      const { nome, sobrenome, email, senha } = this.registerForm.value;

      try {
        // Criar utilizador no Firebase Authentication
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, senha);

        // Guardar dados adicionais no Firestore
        await this.saveUserData(userCredential.user?.uid, nome, sobrenome, email);

        // Enviar e-mail de verificação
        await this.sendVerificationEmail();

        // Mostrar alerta de sucesso
        const alert = await this.alertController.create({
          header: 'Sucesso!',
          message: 'Conta criada. Verifique o seu email para validar a conta.',
          buttons: ['OK']
        });
        await alert.present();

        // Navegar para a página inicial ou qualquer outra página
        this.navCtrl.navigateRoot('/login');
      } catch (error) {
        console.error('Erro ao criar conta:', error);
        const alert = await this.alertController.create({
          header: 'Erro',
          message: 'Ocorreu um erro ao criar a conta. Tente novamente.',
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }

  // Função para salvar dados do utilizador no Firestore
  async saveUserData(uid: string | undefined, nome: string, sobrenome: string, email: string) {
    if (!uid) return;

    const userData = {
      nome,
      sobrenome,
      email
    };

    try {
      // Armazenar os dados do utilizador no Firestore com o UID como documento
      await this.firestore.collection('users').doc(uid).set(userData);
    } catch (error) {
      console.error('Erro ao salvar dados no Firestore:', error);
    }
  }

  // Enviar e-mail de verificação do Firebase Auth
  async sendVerificationEmail() {
    const user = await this.afAuth.currentUser;
    if (user) {
      await user.sendEmailVerification();
      console.log('E-mail de verificação enviado.');
    }
  }

  // Função para obter os dados do utilizador (opcional, Firestore ou Firebase Auth)
  async getUserData() {
    const user = await this.afAuth.currentUser;
    if (user) {
      const userData = await this.firestore.collection('users').doc(user.uid).get().toPromise();
      if (userData?.exists) {
        console.log('Dados do utilizador:', userData.data());
      }
    }
  }
}


