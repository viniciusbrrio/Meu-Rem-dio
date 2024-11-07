export interface Medicamento {
  id?: string; // ID opcional do Firestore
  nome: string;
  tipo: string;
  dosagem: string;
  qnt: number;
  dias: number;
  dataInicio: string;
  horario: string; // Pode ser string ou Date
  userId: string;
  notificationId?: number;
  }