// receita.interface.ts

export interface Receita {
    id?: string;            // ID opcional (definido pelo Firebase)
    imagemUrl: string;       // URL da imagem da receita (salvo após seleção de foto)
    dataValidade: Date;      // Data de validade da receita
    userId: string;          // ID do usuário ao qual a receita pertence
  }
  