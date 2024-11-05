
    export interface Consulta {
        id?: string; // ID opcional do Firestore
        titulo: string;
        medico: string;
        dataHora: string;
        localizacao: string;
        observacoes: string;
        userId: string;
    }