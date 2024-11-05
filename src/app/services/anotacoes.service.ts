import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

export interface Anotacao {
  id?: string;
  conteudo: string;
  dataHora: Date | firebase.firestore.Timestamp;
  userId: string; // ID do usuário associado
}

@Injectable({
  providedIn: 'root'
})
export class AnotacoesService {
  constructor(private firestore: AngularFirestore) {}

  // Método para buscar anotações do usuário específico
  getAnotacoes(userId: string): Observable<Anotacao[]> {
    const anotacoesCollection = this.firestore.collection<Anotacao>('anotacoes', ref => ref.where('userId', '==', userId));
    return anotacoesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Anotacao;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Método para adicionar uma nova anotação associada ao usuário
  adicionarAnotacao(anotacao: Anotacao): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('anotacoes').doc(id).set({ ...anotacao, id });
  }

  // Método para editar uma anotação existente
  editarAnotacao(anotacao: Anotacao): Promise<void> {
    return this.firestore.collection('anotacoes').doc(anotacao.id).update(anotacao);
  }

  // Método para excluir uma anotação
  excluirAnotacao(id: string): Promise<void> {
    return this.firestore.collection('anotacoes').doc(id).delete();
  }
}

