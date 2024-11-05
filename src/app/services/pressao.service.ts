import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Pressao {
  id?: string;
  sistole: string;
  diastole: string;
  dataHora: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PressaoService {
  private pressaoCollection: AngularFirestoreCollection<Pressao>;
  pressao: Observable<Pressao[]>;

  constructor(private firestore: AngularFirestore) {
    this.pressaoCollection = firestore.collection<Pressao>('pressao');
    this.pressao = this.pressaoCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Pressao;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getPressao(): Observable<Pressao[]> {
    return this.pressao;
  }

  adicionarPressao(pressao: Pressao): Promise<void> {
    const id = this.firestore.createId();
    return this.pressaoCollection.doc(id).set({ ...pressao, id });
  }

  editarPressao(pressao: Pressao): Promise<void> {
    return this.pressaoCollection.doc(pressao.id).update(pressao);
  }

  excluirPressao(id: string): Promise<void> {
    return this.pressaoCollection.doc(id).delete();
  }
}
