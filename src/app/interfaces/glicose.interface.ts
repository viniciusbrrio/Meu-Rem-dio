export interface Glicose {
    id?: string;            // Opcional: ID do registro (se estiver usando Firestore, isso pode ser útil)
    conteudo: string;      // Valor da glicose
    dataHora: Date;        // Data e hora da medição
    userId: string;        // ID do usuário que adicionou o registro
  }