import { Injectable } from '@angular/core';
import { Cadastro } from '../interfaces/cadastro.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class CadastroService {
  private collectionName = 'cadastro';

  constructor(private firestore: AngularFirestore) {}

  // Adiciona um novo cadastro ao Firestore
  async addCadastro(cadastro: Cadastro): Promise<void> {
    const cadastroCollection = this.firestore.collection<Cadastro>(this.collectionName);
    await cadastroCollection.add(cadastro);
  }

  // Retorna os cadastros de um utilizador específico
  getCadastros(userId: string): Observable<Cadastro[]> {
    return this.firestore
      .collection<Cadastro>(this.collectionName, ref => ref.where('userId', '==', userId))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Cadastro;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
}


