import { inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  docData, 
  addDoc,
  setDoc,
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
 * BaseFirestoreService: Provee una capa de abstracción CRUD genérica.
 * 
 * Integra automáticamente los Mappers para transformar datos entre 
 * Firestore y las interfaces de negocio de la aplicación.
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

  // --- LECTURA ---

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

  protected getWhere(field: string, value: any, max: number = 20): Observable<T[]> {
    return this.getAll([where(field, '==', value), limit(max)]);
  }

  // --- ESCRITURA ---

  /**
   * Crea un documento en Firestore.
   * @param item Datos del objeto a crear.
   * @param customId (Opcional) Si se provee, se usará como ID del documento (ej. UID de Auth).
   */
  protected async create(item: T, customId?: string): Promise<string> {
    const data = this.mapper.toFirestore(item);
    
    // Limpieza: El ID no debe persistirse dentro del cuerpo del documento
    if (data.id) delete data.id; 

    if (customId) {
      const docRef = doc(this.firestore, `${this.path}/${customId}`);
      await setDoc(docRef, data);
      return customId;
    } else {
      const colRef = collection(this.firestore, this.path);
      const docRef = await addDoc(colRef, data);
      return docRef.id;
    }
  }

  protected async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(this.firestore, `${this.path}/${id}`);
    return updateDoc(docRef, data as DocumentData);
  }

  protected async delete(id: string): Promise<void> {
    const docRef = doc(this.firestore, `${this.path}/${id}`);
    return deleteDoc(docRef);
  }
}