import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Consulta {
  id?: string; // ID opcional do Firestore
  medico: string;
  dataHora: string;
  localizacao: string;
  observacoes: string;
  userId: string;
  concluido?: boolean; // adicionando campo opcional para marcação de consulta como concluída
}

@Injectable({
  providedIn: 'root',
})
export class ConsultaService {
  private collectionName = 'consultas';

  constructor(private firestore: AngularFirestore) {}

  // Adiciona uma nova consulta ao Firestore
  async addConsulta(consulta: Consulta): Promise<void> {
    const consultaCollection = this.firestore.collection<Consulta>(this.collectionName);
    await consultaCollection.add(consulta);
  }

  // Retorna as consultas de um usuário específico
  getConsulta(userId: string): Observable<Consulta[]> {
    return this.firestore
      .collection<Consulta>(this.collectionName, ref => ref.where('userId', '==', userId))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Consulta;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  // Remove uma consulta com base no ID
  async removeConsulta(id: string): Promise<void> {
    const consultaDoc = this.firestore.doc(`${this.collectionName}/${id}`);
    await consultaDoc.delete();
  }

  // Marca uma consulta como concluída
  async marcarComoConcluida(id: string): Promise<void> {
    const consultaDoc = this.firestore.doc(`${this.collectionName}/${id}`);
    await consultaDoc.update({ concluido: true });
  }
}
