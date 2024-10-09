import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private collectionName = 'users'; // Nome da coleção no Firestore

  constructor(private firestore: AngularFirestore) {}

  // Obter todos os utilizadores da coleção 'users' no Firestore
  getUsers(): Observable<User[]> {
    return this.firestore.collection<User>(this.collectionName).valueChanges({ idField: 'id' });
  }

  // Guardar um novo utilizador na coleção 'users'
  saveUser(user: User): Promise<void> {
    const id = this.firestore.createId(); // Gera um ID único para o utilizador
    return this.firestore.collection(this.collectionName).doc(id).set({ ...user, id });
  }

  // Obter utilizador pelo ID
  getUserById(id: string): Observable<User | undefined> {
    return this.firestore.collection<User>(this.collectionName).doc(id).valueChanges();
  }
}



