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

  getGlicose(): Observable<Glicose[]> {
    return this.glicose;
  }


  adicionarGlicose(glicose: Glicose): Promise<void> {
    const registro = {
      ...glicose,
      dataHora: glicose.dataHora instanceof Date ? glicose.dataHora : new Date(glicose.dataHora),
    };
    const id = this.firestore.createId();
    return this.firestore.collection('glicose').doc(id).set(registro);
  }
  
  editarGlicose(id: string, glicose: Glicose): Promise<void> {
    const registroAtualizado = {
      ...glicose,
      dataHora: glicose.dataHora instanceof Date ? glicose.dataHora : new Date(glicose.dataHora),
    };
    return this.firestore.collection('glicose').doc(id).update(registroAtualizado);
  }

  excluirGlicose(id: string): Promise<void> {
    return this.firestore.collection('glicose').doc(id).delete();
  }
}

