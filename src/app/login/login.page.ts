import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importar Firebase Authentication

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private alertController: AlertController, // Para mostrar alertas de erro
    private afAuth: AngularFireAuth // Injeção do Firebase Auth para autenticação
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      try {
        // Tenta autenticar o utilizador com Firebase Authentication
        const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
        
        // Login bem-sucedido, navega para a página principal
        console.log('Login bem-sucedido!', userCredential);
        this.navCtrl.navigateForward('/home');
        
      } catch (error: any) {
        // Tratamento de erros durante o login
        console.error('Erro de login:', error);
        let errorMessage = 'Ocorreu um erro ao fazer login. Por favor, tente novamente.';
        
        if (error && error.code === 'auth/user-not-found') {
          errorMessage = 'Utilizador não encontrado. Por favor, verifique o email.';
        } else if (error.code === 'auth/wrong-password') {
          errorMessage = 'Senha incorreta. Por favor, tente novamente.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Email inválido. Por favor, verifique e tente novamente.';
        }
        
        await this.showErrorAlert(errorMessage);
      }
    }
  }

  // Função para mostrar alerta de erro
  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Erro de Login',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}



