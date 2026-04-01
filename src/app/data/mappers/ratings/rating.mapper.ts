import { Timestamp } from '@angular/fire/firestore';
import { Rating, RatingTargetType } from '../../interfaces';

/**
 * RatingMapper: Responsable de la transformación de las calificaciones y reseñas.
 * 
 * Este mapper garantiza que el feedback entre clientes y negocios sea consistente,
 * normalizando las etiquetas de opinión y asegurando que las fechas y puntuaciones
 * sean válidas para el cálculo de promedios de reputación.
 */
export class RatingMapper {

  /**
   * Transforma un documento de Firestore a la interfaz Rating.
   * @param id El identificador único de la calificación.
   * @param data Atributos del documento en la colección 'ratings'.
   */
  static fromFirestore(id: string, data: Omit<Rating, 'id'>): Rating {
    return {
      id,
      author_id: data.author_id || '',
      created_at: this.mapDate(data.created_at),
      is_visible: !!data.is_visible,
      order_id: data.order_id || '',
      rate: Number(data.rate) || 0,
      // Aseguramos que las etiquetas sean siempre un array para usar .map() en la UI
      tags: Array.isArray(data.tags) ? data.tags : [],
      target_id: data.target_id || '',
      target_type: (data.target_type as RatingTargetType) || 'negocio'
    };
  }

  /**
   * Prepara el objeto Rating para ser persistido en Firestore.
   */
  static toFirestore(rating: Rating): Omit<Rating, 'id'> {
    return {
      author_id: rating.author_id,
      created_at: rating.created_at || new Date(),
      is_visible: rating.is_visible,
      order_id: rating.order_id,
      rate: rating.rate,
      tags: rating.tags,
      target_id: rating.target_id,
      target_type: rating.target_type
    };
  }

  /**
   * Normalización estricta de fechas para el sistema de reseñas.
   * Maneja la conversión de Timestamp de Firestore a Date nativo.
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