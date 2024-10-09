import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

interface Medicamento {
  nome: string;
  tipo: string;
  dosagem: string;
  qnt: number;
  dias: number;
  horario: string;
  concluido?: boolean;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class MedicamentoService {
  private storageKey = 'medicamentos';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  async addMedicamento(medicamento: Medicamento): Promise<void> {
    const medicamentos = await this.getMedicamentos(medicamento.userId);
    medicamentos.push(medicamento);
    await this.saveMedicamentos(medicamento.userId, medicamentos);
  }

  async getMedicamentos(userId: string): Promise<Medicamento[]> {
    const medicamentosStr = await this.storage.get(this.storageKey);
    const medicamentos = medicamentosStr ? JSON.parse(medicamentosStr) : [];
    return medicamentos.filter((medicamento: Medicamento) => medicamento.userId === userId);
  }

  async removeMedicamento(nome: string, userId: string): Promise<void> {
    const medicamentos = await this.getMedicamentos(userId);
    const medicamentosFiltrados = medicamentos.filter(med => med.nome !== nome || med.userId !== userId);
    await this.saveMedicamentos(userId, medicamentosFiltrados);
  }

  async marcarComoConcluida(nome: string, userId: string): Promise<void> {
    const medicamentos = await this.getMedicamentos(userId);
    const medicamentoIndex = medicamentos.findIndex(med => med.nome === nome && med.userId === userId);
    if (medicamentoIndex !== -1) {
      medicamentos[medicamentoIndex].concluido = true;
      await this.saveMedicamentos(userId, medicamentos);
    }
  }

  private async saveMedicamentos(userId: string, medicamentos: Medicamento[]) {
    await this.storage.set(this.storageKey, JSON.stringify(medicamentos));
  }
}





