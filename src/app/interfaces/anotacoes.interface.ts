import { Timestamp } from "rxjs";

export interface Anotacoes {
    id?: string; // ID opcional do Firestore
    conteudo: string;
    dataHora: string; // Pode ser string ou Date
    userId: string;
    }