import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Medicamento {
  nome: string;
  tipo: string;
  dosagem: string;
  qnt: number;
  dias: number;
  horario: string;
  concluido?: boolean;
  userId: string;
  notificationId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class MedicamentoService {
  private collectionName = 'medicamentos';

  constructor(private firestore: AngularFirestore) {}

  // Adiciona um novo medicamento ao Firestore
  async addMedicamento(medicamento: Medicamento): Promise<void> {
    const medicamentosCollection = this.firestore.collection<Medicamento>(this.collectionName);
    await medicamentosCollection.add(medicamento);
  }

  // Retorna os medicamentos de um utilizador específico
  getMedicamentos(userId: string): Observable<Medicamento[]> {
    return this.firestore
      .collection<Medicamento>(this.collectionName, ref => ref.where('userId', '==', userId))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Medicamento;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  // Remove um medicamento com base no nome e no userId
  async removeMedicamento(id: string): Promise<void> {
    const medicamentoDoc = this.firestore.doc(`${this.collectionName}/${id}`);
    await medicamentoDoc.delete();
  }

  // Marca um medicamento como concluído
  async marcarComoConcluida(id: string): Promise<void> {
    const medicamentoDoc = this.firestore.doc(`${this.collectionName}/${id}`);
    await medicamentoDoc.update({ concluido: true });
  }

  // Método para atualizar medicamento, incluindo o notificationId
  async updateMedicamento(id: string, data: Partial<Medicamento>) {
    return this.firestore.collection('medicamentos').doc(id).update(data);
  }

  
}






