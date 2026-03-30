/* este servicio se encarga de manejar todas las operaciones relacionadas 
con los productos, como obtener la lista de productos de un negocio,
 agregar nuevos productos y actualizar los existentes.
  Se utiliza Firestore para almacenar y recuperar los datos de los productos. */
import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  docData, 
  query, 
  where, 
  orderBy,
  addDoc,
  updateDoc,
  Timestamp 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../../../data/interfaces'; // Barrel import

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly collectionName = 'products';

  constructor(private firestore: Firestore) {}

  /**
   * Obtiene todos los productos de un negocio específico (Vista Cliente/Negocio)
   */
  getProductsByBusiness(businessId: string): Observable<Product[]> {
    const productsRef = collection(this.firestore, this.collectionName);
    const q = query(
      productsRef, 
      where('business_id', '==', businessId),
      orderBy('name', 'asc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  /**
   * Obtiene solo los productos habilitados (Vista Cliente)
   */
  getAvailableProductsByBusiness(businessId: string): Observable<Product[]> {
    const productsRef = collection(this.firestore, this.collectionName);
    const q = query(
      productsRef, 
      where('business_id', '==', businessId),
      where('is_enabled', '==', true),
      orderBy('name', 'asc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  /**
   * Agrega un nuevo producto al catálogo
   */
  async addProduct(product: Omit<Product, 'id'>): Promise<void> {
    const productsRef = collection(this.firestore, this.collectionName);
    await addDoc(productsRef, {
      ...product,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
  }

  /**
   * Actualiza datos del producto (precio, stock, etc.)
   */
  async updateProduct(id: string, data: Partial<Product>): Promise<void> {
    const productRef = doc(this.firestore, `${this.collectionName}/${id}`);
    await updateDoc(productRef, {
      ...data,
      updated_at: Timestamp.now()
    });
  }
}