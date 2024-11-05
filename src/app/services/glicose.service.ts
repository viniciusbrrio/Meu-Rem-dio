import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Glicose } from '../interfaces/glicose.interface';

@Injectable({
  providedIn: 'root'
})
export class GlicoseService {
  private glicoseCollection: AngularFirestoreCollection<Glicose>;
  glicose: Observable<Glicose[]>;

  constructor(private firestore: AngularFirestore) {
    this.glicoseCollection = firestore.collection<Glicose>('glicose');
    this.glicose = this.glicoseCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Glicose;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Obter todos os registros de glicose
  getGlicose(): Observable<Glicose[]> {
    return this.glicose;
  }

  // Método para adicionar registro
  adicionarGlicose(glicose: Glicose): Promise<void> {
    const id = this.firestore.createId(); // Gera um ID único
    return this.firestore.collection('glicose').doc(id).set(glicose);
  }

  // Método para editar registro
  editarGlicose(id: string, glicose: Glicose): Promise<void> {
    return this.firestore.collection('glicose').doc(id).update(glicose);
  }

  // Método para excluir registro
  excluirGlicose(id: string): Promise<void> {
    return this.firestore.collection('glicose').doc(id).delete();
  }
}

