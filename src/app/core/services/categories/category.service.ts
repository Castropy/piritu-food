// Este servicio maneja las operaciones CRUD para las categorías de los menús de los negocios.
// Se encarga de obtener las categorías ordenadas para la UI, agregar nuevas categorías 
// y actualizar las existentes.
// Utiliza Firestore para almacenar y recuperar los datos de las categorías, y se 
// asegura de que solo se obtengan las categorías habilitadas para un negocio específico, 
// ordenadas por su orden de visualización.
import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  query, 
  where, 
  orderBy, 
  addDoc,
  doc,
  updateDoc,
  Timestamp 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../../../data/interfaces'; // Barrel import

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly collectionName = 'categories';

  constructor(private firestore: Firestore) {}

  /**
   * Obtiene las categorías de un negocio ordenadas para la UI
   */
  getCategoriesByBusiness(businessId: string): Observable<Category[]> {
    const categoriesRef = collection(this.firestore, this.collectionName);
    const q = query(
      categoriesRef, 
      where('business_id', '==', businessId),
      where('is_enabled', '==', true),
      orderBy('display_order', 'asc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Category[]>;
  }

  /**
   * Agrega una nueva categoría al menú del negocio
   */
  async addCategory(category: Omit<Category, 'id'>): Promise<void> {
    const categoriesRef = collection(this.firestore, this.collectionName);
    await addDoc(categoriesRef, {
      ...category,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
  }

  /**
   * Actualiza una categoría (nombre, orden, descripción)
   */
  async updateCategory(id: string, data: Partial<Category>): Promise<void> {
    const categoryRef = doc(this.firestore, `${this.collectionName}/${id}`);
    await updateDoc(categoryRef, {
      ...data,
      updated_at: Timestamp.now()
    });
  }
}