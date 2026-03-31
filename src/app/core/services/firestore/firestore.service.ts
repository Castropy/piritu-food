import { inject, Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  docData, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  limit, 
  DocumentData,
  WithFieldValue
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);

  /**
   * Obtiene items filtrados por un campo específico.
   * Eliminamos el casteo manual a CollectionReference para evitar el error de instancia.
   */
  getFiltered<T>(path: string, field: string, value: any): Observable<T[]> {
    const colRef = collection(this.firestore, path);
    const q = query(colRef, where(field, '==', value));
    
    // Dejamos que el genérico se maneje aquí directamente
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Obtiene items destacados.
   */
  getFeatured<T>(path: string, max: number = 6): Observable<T[]> {
    const colRef = collection(this.firestore, path);
    const q = query(colRef, limit(max)); 
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Obtiene una colección completa.
   */
  getCollection<T>(path: string): Observable<T[]> {
    const colRef = collection(this.firestore, path);
    return collectionData(colRef, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Obtiene un solo documento por su ID.
   */
  getDoc<T>(path: string, id: string): Observable<T> {
    const docRef = doc(this.firestore, `${path}/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<T>;
  }

  // --- MÉTODOS DE ESCRITURA ---

  async createDoc<T extends DocumentData>(path: string, data: WithFieldValue<T>): Promise<string> {
    const colRef = collection(this.firestore, path);
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  }

  async updateDoc(path: string, id: string, data: Partial<DocumentData>): Promise<void> {
    const docRef = doc(this.firestore, `${path}/${id}`);
    return updateDoc(docRef, data);
  }

  async deleteDoc(path: string, id: string): Promise<void> {
    const docRef = doc(this.firestore, `${path}/${id}`);
    return deleteDoc(docRef);
  }
}