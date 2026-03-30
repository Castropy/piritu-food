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
  orderBy,
  CollectionReference,
  DocumentReference,
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
   * --- LECTURAS EN TIEMPO REAL (REACCIONAN A CAMBIOS) ---
   */

  /**
   * Obtiene una colección completa mapeada a un tipo genérico.
   * @template T Debe ser un objeto que acepte una propiedad 'id' opcional.
   */
  getCollection<T extends { id?: string }>(path: string): Observable<T[]> {
    const ref = collection(this.firestore, path) as CollectionReference<T>;
    // Usamos 'as any' para el idField para evitar conflictos estrictos de tipos de AngularFire
    return collectionData(ref, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Obtiene items destacados (Lobby/Store) con límite y orden.
   */
  getFeatured<T extends { id?: string }>(path: string, max: number = 6): Observable<T[]> {
    const ref = collection(this.firestore, path) as CollectionReference<T>;
    const q = query(ref, limit(max), orderBy('createdAt', 'desc')); 
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Obtiene items filtrados por un campo específico.
   * Ej: getFiltered<Product>('products', 'category', 'pizzas')
   */
  getFiltered<T extends { id?: string }>(path: string, field: string, value: any): Observable<T[]> {
    const ref = collection(this.firestore, path) as CollectionReference<T>;
    const q = query(ref, where(field, '==', value));
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Obtiene un solo documento por su ID.
   */
  getDoc<T extends { id?: string }>(path: string, id: string): Observable<T> {
    const ref = doc(this.firestore, `${path}/${id}`) as DocumentReference<T>;
    return docData(ref, { idField: 'id' }) as Observable<T>;
  }

  /**
   * --- OPERACIONES DE ESCRITURA (PROMESAS) ---
   */

  /**
   * Crea un documento nuevo.
   * Precaución: No olvides añadir 'createdAt' manualmente si quieres usar getFeatured.
   */
  async createDoc<T extends DocumentData>(path: string, data: WithFieldValue<T>): Promise<string> {
    try {
      const ref = collection(this.firestore, path);
      const docRef = await addDoc(ref, data);
      return docRef.id;
    } catch (error) {
      console.error(`[FirestoreService] Error en createDoc (${path}):`, error);
      throw error;
    }
  }

  /**
   * Actualiza campos específicos de un documento.
   */
  async updateDoc(path: string, id: string, data: Partial<DocumentData>): Promise<void> {
    try {
      const ref = doc(this.firestore, `${path}/${id}`);
      await updateDoc(ref, data);
    } catch (error) {
      console.error(`[FirestoreService] Error en updateDoc (${id}):`, error);
      throw error;
    }
  }

  /**
   * Elimina un documento de la base de datos.
   */
  async deleteDoc(path: string, id: string): Promise<void> {
    try {
      const ref = doc(this.firestore, `${path}/${id}`);
      await deleteDoc(ref);
    } catch (error) {
      console.error(`[FirestoreService] Error en deleteDoc (${id}):`, error);
      throw error;
    }
  }
}