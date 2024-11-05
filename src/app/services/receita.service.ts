// receita.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Receita } from '../interfaces/receita.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReceitaService {

  constructor(private firestore: AngularFirestore) {}

  // Adicionar nova receita
  adicionarReceita(receita: Receita): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('receita').doc(id).set({ ...receita, id });
  }

  // Obter receitas de um usuário específico
  getReceitasByUserId(userId: string): Observable<Receita[]> {
    return this.firestore
      .collection<Receita>('receita', ref => ref.where('userId', '==', userId))
      .valueChanges({ idField: 'id' });
  }

  // Editar uma receita
  editarReceita(id: string, receitaAtualizada: Receita): Promise<void> {
    return this.firestore.collection('receita').doc(id).update(receitaAtualizada);
  }

  // Excluir uma receita
  excluirReceita(id: string): Promise<void> {
    return this.firestore.collection('receita').doc(id).delete();
  }
}
