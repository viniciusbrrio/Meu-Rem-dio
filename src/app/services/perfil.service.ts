import { Injectable } from '@angular/core';
import {Cadastro} from '../interfaces/cadastro.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private collectionName = 'cadastro';

  constructor(private firestore: AngularFirestore) {}


  getCadastroByUserId(userId: string): Observable<Cadastro | undefined> {
    return this.firestore
      .collection<Cadastro>(this.collectionName, ref => 
        ref.where('userId', '==', userId).limit(1))
      .snapshotChanges()
      .pipe(
        map(actions => {
          if (actions.length === 0) return undefined;
          const action = actions[0];
          const data = action.payload.doc.data() as Cadastro;
          const id = action.payload.doc.id;
          return { id, ...data };
        }),
        catchError(error => {
          console.error('Erro ao buscar cadastro:', error);
          throw error;
        })
      );
  }

  // Atualiza os dados do cadastro
  async updateCadastro(cadastroId: string, dadosAtualizados: Partial<Cadastro>): Promise<void> {
    try {
      const docRef = this.firestore.doc(`${this.collectionName}/${cadastroId}`);
      await docRef.update(dadosAtualizados);
    } catch (error) {
      console.error('Erro ao atualizar cadastro:', error);
      throw error;
    }
  }
}

