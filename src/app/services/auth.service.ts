// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { Platform } from '@ionic/angular';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'; // Importando GoogleAuth para Capacitor

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private platform: Platform) {}

  // Login com Google, usando Firebase Authentication
  async loginComGoogle(): Promise<any> {
    try {
      if (this.platform.is('capacitor')) {
        // Configuração para execução em dispositivos móveis com Capacitor
        const googleUser = await this.loginComGoogleCapacitor();
        if (googleUser) {
          const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
          const userCredential = await this.afAuth.signInWithCredential(credential);
          return userCredential; // Retorna as credenciais do usuário autenticado
        }
      } else {
        // Configuração para web
        const userCredential = await this.afAuth.signInWithPopup(new GoogleAuthProvider());
        return userCredential; // Retorna as credenciais do usuário autenticado
      }
    } catch (error) {
      console.error('Erro no login com Google:', error);
      throw error;
    }
  }

  // Login com Google para dispositivos móveis (Capacitor)
  private async loginComGoogleCapacitor(): Promise<any> {
    try {
      const result = await GoogleAuth.signIn();
      return result; // Retorna o resultado do login
    } catch (error) {
      console.error('Erro no login com Google no Capacitor:', error);
      throw error;
    }
  }

  // Logout do usuário
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  }
}

