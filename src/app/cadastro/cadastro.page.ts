import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Firebase Auth
import { CadastroService } from '../services/cadastro.service'; // Serviço de Cadastro

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  registerForm!: FormGroup;
  passwordsDoNotMatch = false;
  showCustomEstadoField: boolean = false; // Para mostrar o campo de estado manual

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private alertController: AlertController,
    private afAuth: AngularFireAuth, // Injeção do Firebase Auth
    private cadastroService: CadastroService // Injeção do serviço de Cadastro
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      estado: ['', Validators.required],
      customEstado: [''], // Campo para o estado manual
      bairro: ['', Validators.required],
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

    // Monitorar mudanças no estado para exibir o campo "customEstado" quando "Outro" for selecionado
    this.registerForm.get('estado')?.valueChanges.subscribe((value) => {
      if (value === 'Outro') {
        this.showCustomEstadoField = true;
        this.registerForm.get('customEstado')?.setValidators(Validators.required);
      } else {
        this.showCustomEstadoField = false;
        this.registerForm.get('customEstado')?.clearValidators();
      }
      this.registerForm.get('customEstado')?.updateValueAndValidity();
    });
  }

  async onRegister() {
    if (this.registerForm.valid && !this.passwordsDoNotMatch) {
      const { nome, sobrenome, dataNascimento, bairro, email, senha } = this.registerForm.value;
      const estado = this.registerForm.value.estado === 'Outro'
        ? this.registerForm.value.customEstado
        : this.registerForm.value.estado;

      try {
        // Criar utilizador no Firebase Authentication
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, senha);
        const userId = userCredential.user?.uid;

        if (userId) {
          // Guardar dados adicionais no Firestore através do serviço
          await this.cadastroService.addCadastro({
            nome,
            sobrenome,
            dataNascimento,
            estado,
            bairro,
            email,
            senha,
            userId
          });

          // Enviar e-mail de verificação
          await this.sendVerificationEmail();

          // Mostrar alerta de sucesso
          const alert = await this.alertController.create({
            header: 'Sucesso!',
            message: 'Conta criada. Verifique o seu email para validar a conta.',
            buttons: ['OK']
          });
          await alert.present();

          // Navegar para a página de login
          this.navCtrl.navigateRoot('/login');
        }
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

  onEstadoChange(event: any) {
    const selectedValue = event.detail.value;
  
    if (selectedValue === 'Outro') {
      this.showCustomEstadoField = true;
      this.registerForm.get('customEstado')?.setValidators(Validators.required);
    } else {
      this.showCustomEstadoField = false;
      this.registerForm.get('customEstado')?.clearValidators();
    }
  
    this.registerForm.get('customEstado')?.updateValueAndValidity();
  }
  

  // Enviar e-mail de verificação do Firebase Auth
  async sendVerificationEmail() {
    const user = await this.afAuth.currentUser;
    if (user) {
      await user.sendEmailVerification();
      console.log('E-mail de verificação enviado.');
    }
  }
}



