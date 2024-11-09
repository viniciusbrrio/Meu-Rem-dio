export interface Medicamento {
  nome: string;
  tipo: string;
  dosagem: string;
  qnt: number;
  dias: number;
  horario: string;
  concluido?: boolean;
  userId: string;
  notificationId?: number;  // Adicionando a propriedade notificationId
}