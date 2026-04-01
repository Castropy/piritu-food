import { inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  docData, 
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query, 
  where,
  limit,
  QueryConstraint,
  DocumentData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * BaseFirestoreService: Evolución del FirestoreService original.
 * 
 * Implementa un CRUD genérico que integra automáticamente los Mappers de la capa data.
 * T: Interfaz de Negocio (ej: Product).
 */
export abstract class BaseFirestoreService<T extends { id?: string }> {
  
  protected firestore = inject(Firestore);

  constructor(
    protected path: string,
    protected mapper: { 
      fromFirestore: (id: string, data: any) => T,
      toFirestore: (item: T) => any 
    }
  ) {}

  // --- MÉTODOS DE LECTURA (READ) ---

  protected getAll(constraints: QueryConstraint[] = []): Observable<T[]> {
    const colRef = collection(this.firestore, this.path);
    const q = query(colRef, ...constraints);
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(d => this.mapper.fromFirestore(d['id'], d)))
    );
  }

  protected getById(id: string): Observable<T> {
    const docRef = doc(this.firestore, `${this.path}/${id}`);
    return docData(docRef, { idField: 'id' }).pipe(
      map(data => {
        if (!data) throw new Error(`[${this.path}] Documento ${id} no encontrado`);
        return this.mapper.fromFirestore(id, data);
      })
    );
  }

  /**
   * Reemplaza a 'getFiltered' del servicio anterior.
   */
  protected getWhere(field: string, value: any, max: number = 20): Observable<T[]> {
    return this.getAll([where(field, '==', value), limit(max)]);
  }

  // --- MÉTODOS DE ESCRITURA (WRITE) ---

  /**
   * Crea un documento usando el Mapper 'toFirestore' para limpiar la data.
   */
  protected async create(item: T): Promise<string> {
    const colRef = collection(this.firestore, this.path);
    const data = this.mapper.toFirestore(item);
    // Eliminamos el ID si existe para que Firestore genere uno nuevo
    delete data.id; 
    
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  }

  /**
   * Actualiza un documento existente.
   */
  protected async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(this.firestore, `${this.path}/${id}`);
    // Aquí podrías opcionalmente pasar data por un mapper de actualización si fuera necesario
    return updateDoc(docRef, data as DocumentData);
  }

  /**
   * Elimina un documento.
   */
  protected async delete(id: string): Promise<void> {
    const docRef = doc(this.firestore, `${this.path}/${id}`);
    return deleteDoc(docRef);
  }
}