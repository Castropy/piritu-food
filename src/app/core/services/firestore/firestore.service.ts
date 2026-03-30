import { inject, Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  docData, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  limit, 
  orderBy 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);

  /**
   * Obtiene una colección completa con IDs incluidos
   * @param path Nombre de la colección (ej: 'products')
   */
  getCollection<T>(path: string): Observable<T[]> {
    const ref = collection(this.firestore, path);
    return collectionData(ref, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Obtiene documentos filtrados (Ej: Solo productos de una categoría)
   */
  getFilteredCollection<T>(path: string, field: string, value: any): Observable<T[]> {
    const ref = collection(this.firestore, path);
    const q = query(ref, where(field, '==', value));
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Los "Destacados" del Lobby: Limita la carga para ahorrar cuota
   */
  getFeaturedItems<T>(path: string, max: number = 6): Observable<T[]> {
    const ref = collection(this.firestore, path);
    const q = query(ref, limit(max)); // Podrías añadir orderBy('sales', 'desc')
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Obtener un solo documento (Ej: Detalle de un negocio)
   */
  getDocById<T>(path: string, id: string): Observable<T> {
    const ref = doc(this.firestore, `${path}/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<T>;
  }

  /**
   * Crear un nuevo registro (Ej: El negocio subiendo un plato)
   */
  async createDoc(path: string, data: any) {
    const ref = collection(this.firestore, path);
    return await addDoc(ref, data);
  }

  /**
   * Actualizar datos (Ej: Cambiar precio de un producto)
   */
  async updateDoc(path: string, id: string, data: any) {
    const ref = doc(this.firestore, `${path}/${id}`);
    return await updateDoc(ref, data);
  }
}