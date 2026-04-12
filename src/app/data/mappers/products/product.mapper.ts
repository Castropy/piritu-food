import { Timestamp } from '@angular/fire/firestore';
import { Product } from '../../interfaces';

/**
 * ProductMapper: Responsable de la transformación de datos para los productos (platos/bebidas).
 * 
 * Se encarga de normalizar listas de ingredientes y extras, asegurando que la UI
 * siempre reciba arrays válidos y precios operables, independientemente del estado de la base de datos.
 */
export class ProductMapper {

  /**
   * Transforma un documento de Firestore a la interfaz Product.
   * @param id El identificador único del producto.
   * @param data Atributos del documento en la colección 'products'.
   */
  static fromFirestore(id: string, data: Omit<Product, 'id'>): Product {
    return {
      id,
      business_id: data.business_id || '',
      category_id: data.category_id || '',
      // Aseguramos arrays vacíos para evitar errores de renderizado en la UI
      extras: Array.isArray(data.extras) ? data.extras : [],
      image_url: data.image_url || null,
      ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
      is_enabled: !!data.is_enabled,
      name: data.name || 'Producto sin nombre',
      price: Number(data.price) || 0,
      created_at: this.mapDate(data.created_at),
      updated_at: data.updated_at ? this.mapDate(data.updated_at) : undefined,
      is_available: data.is_available ?? true,
    };
  }

  /**
   * Prepara el objeto Product para ser persistido en Firestore.
   */
  static toFirestore(product: Product): Omit<Product, 'id'> {
    return {
      business_id: product.business_id,
      category_id: product.category_id,
      extras: product.extras,
      image_url: product.image_url,
      ingredients: product.ingredients,
      is_enabled: product.is_enabled,
      name: product.name,
      price: product.price,
      is_available: product.is_available ?? true,
      created_at: product.created_at || new Date(),
      updated_at: new Date()
    };
  }

  /**
   * Normalización estricta de fechas para el catálogo de productos.
   * Utiliza la clase Timestamp de @angular/fire/firestore para la validación.
   */
  private static mapDate(date: Timestamp | Date | undefined): Date {
    if (date instanceof Timestamp) {
      return date.toDate();
    }
    if (date instanceof Date) {
      return date;
    }
    return new Date();
  }
}