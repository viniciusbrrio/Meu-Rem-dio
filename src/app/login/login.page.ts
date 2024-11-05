import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Redireciona para "home" se o usuário já estiver logado
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.router.navigate(['/home']);
      }
    });

    // Verifica o resultado do redirecionamento após login com Google
    this.checkGoogleLogin();

    this.afAuth.getRedirectResult().then(result => {
      if (result.user) {
          this.router.navigate(['/home']);
      }
  }).catch(error => {
      console.error('Erro no redirecionamento de login:', error);
      this.showToast('Erro ao redirecionar para o login', 'danger');
  });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      const loading = await this.loadingCtrl.create({ message: 'Aguarde...', spinner: 'crescent' });
      await loading.present();

      try {
        const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
        console.log('Login bem-sucedido!', userCredential);
        await this.router.navigate(['/home']);
      } catch (error: any) {
        await this.handleError(error);
      } finally {
        await loading.dismiss();
      }
    }
  }

  // Função para login com Google usando redirecionamento
  async onGoogleLogin() {
    const loading = await this.loadingCtrl.create({ message: 'Aguarde...', spinner: 'crescent' });
    await loading.present();

    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await this.afAuth.signInWithPopup(provider); // Alterado para signInWithPopup
        await this.router.navigate(['/home']);
    } catch (error) {
        console.error('Erro ao fazer login com Google:', error);
        await this.showToast('Erro ao fazer login com Google', 'danger');
    } finally {
        await loading.dismiss();
    }
}

  // Verifica o resultado do redirecionamento após login com Google
  private async checkGoogleLogin() {
    try {
      const result = await this.afAuth.getRedirectResult();
      if (result.user) {
        console.log('Login com Google bem-sucedido!', result);
        await this.showToast('Login bem-sucedido com Google!', 'success');
        this.router.navigate(['/home']);  // Redireciona para "home" após login
      }
    } catch (error) {
      console.error('Erro ao verificar login com Google:', error);
      await this.showToast('Erro ao verificar login com Google', 'danger');
    }
  }

  // Função para tratamento de erros de autenticação
  private async handleError(error: any) {
    let errorMessage = 'Ocorreu um erro ao fazer login. Por favor, tente novamente.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'Utilizador não encontrado. Por favor, verifique o email.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Senha incorreta. Por favor, tente novamente.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email inválido. Por favor, verifique e tente novamente.';
        break;
    }
    
    await this.showErrorAlert(errorMessage);
  }

  // Função para mostrar alertas de erro
  private async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Erro de Login',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Função para mostrar uma notificação Toast
  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 2000
    });
    await toast.present();
  }
}






