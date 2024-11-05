export interface Pressao {
    id?: string;            // Opcional: ID do registro (se estiver usando Firestore, isso pode ser útil)
    sistole: string;   
    diastole: string;   
    dataHora: Date;        // Data e hora da medição
    userId: string;        // ID do usuário que adicionou o registro
  }