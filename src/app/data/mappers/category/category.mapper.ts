import { Timestamp } from 'firebase/firestore';
import { Category } from '../../interfaces';

/**
 * CategoryMapper: Responsable de la transformación de datos para las categorías de productos.
 * 
 * Este mapper asegura que la jerarquía y el orden visual de la tienda se mantengan
 * consistentes, normalizando los tipos de datos de Firestore al modelo de la aplicación.
 */
export class CategoryMapper {

  /**
   * Transforma un documento de Firestore a la interfaz Category.
   * @param id El identificador único del documento de categoría.
   * @param data Atributos del documento (excluyendo el ID).
   */
  static fromFirestore(id: string, data: Omit<Category, 'id'>): Category {
    return {
      id,
      business_id: data.business_id || '',
      description: data.description || '',
      display_order: typeof data.display_order === 'number' ? data.display_order : 0,
      is_enabled: !!data.is_enabled,
      name: data.name || 'Categoría sin nombre',
      product_count: data.product_count || 0,
      created_at: this.mapDate(data.created_at),
      updated_at: data.updated_at ? this.mapDate(data.updated_at) : undefined
    };
  }

  /**
   * Prepara el objeto Category para ser almacenado en Firestore.
   */
  static toFirestore(category: Category): Omit<Category, 'id'> {
    return {
      business_id: category.business_id,
      description: category.description,
      display_order: category.display_order,
      is_enabled: category.is_enabled,
      name: category.name,
      product_count: category.product_count,
      created_at: category.created_at || new Date(),
      updated_at: new Date()
    };
  }

  /**
   * Normalización estricta para objetos de fecha.
   * Soporta nativamente Timestamps de Firebase y objetos Date de JS.
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