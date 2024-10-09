export interface Medicamento {
    nome: string;
    tipo: string;
    dosagem: string;
    qnt: number;
    dias: number;
    horario: string; // ou Date
    userId: string; // Associar o medicamento ao userId
  }