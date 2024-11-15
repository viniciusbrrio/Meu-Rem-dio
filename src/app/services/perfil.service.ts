import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface UserProfile {
  nome: string;
  sobrenome: string;
  dataNascimento: string;
  estado: string;
  bairro: string;
  email: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private collectionName = 'cadastro';

  constructor(private firestore: AngularFirestore) {}

  // Método para obter o perfil do utilizador com base no ID
  getUserProfile(userId: string): Observable<UserProfile | undefined> {
    return this.firestore
      .collection<UserProfile>(this.collectionName)
      .doc(userId)
      .snapshotChanges()
      .pipe(
        map(action => {
          const data = action.payload.data() as UserProfile | undefined;
          if (data) {
            return { ...data, userId: action.payload.id };
          } else {
            return undefined;
          }
        }),
        catchError(error => {
          console.error('Erro ao carregar o perfil:', error);
          return throwError(() => new Error('Erro ao carregar o perfil.'));
        })
      );
  }

  // Método para atualizar o perfil do utilizador
  updateUserProfile(userId: string, profileData: UserProfile): Promise<void> {
    return this.firestore
      .collection<UserProfile>(this.collectionName)
      .doc(userId)
      .set(profileData)
      .then(() => {
        console.log('Perfil atualizado com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao atualizar o perfil:', error);
        throw new Error('Erro ao atualizar o perfil.');
      });
  }
}
