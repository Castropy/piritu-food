import { Timestamp } from 'firebase/firestore';
import { Business } from '../../interfaces';

/**
 * BusinessMapper: Transforma la data entre Firestore y la entidad Business.
 * 
 * Por qué: Los negocios tienen campos complejos (arrays de fotos, horarios en string).
 * Este mapper asegura que la UI siempre reciba estructuras válidas y limpias.
 */
export class BusinessMapper {

  /**
   * Mapea el documento de Firestore a la interfaz Business del sistema.
   * @param id UID del documento del negocio.
   * @param data Datos crudos de la colección 'businesses'.
   */
  static fromFirestore(id: string, data: Omit<Business, 'id'>): Business {
    return {
      id,
      address: data.address || '',
      closing_time: data.closing_time || '22:00', // Valor por defecto sensato
      description: data.description || '',
      email: data.email || '',
      gallery_urls: data.gallery_urls || [],
      image_url: data.image_url || 'assets/images/default-business.png',
      is_blocked: !!data.is_blocked,
      is_verified: !!data.is_verified,
      name: data.name || 'Negocio sin nombre',
      opening_time: data.opening_time || '08:00',
      owner_name: data.owner_name || '',
      penalty_status: data.penalty_status || 0,
      phone: data.phone || '',
      tax_id: data.tax_id || '',
      created_at: this.mapDate(data.created_at),
      updated_at: data.updated_at ? this.mapDate(data.updated_at) : undefined
    };
  }

  /**
   * Prepara la entidad Business para ser persistida en Firestore.
   */
  static toFirestore(business: Business): Omit<Business, 'id'> {
    return {
      address: business.address,
      closing_time: business.closing_time,
      description: business.description,
      email: business.email,
      gallery_urls: business.gallery_urls,
      image_url: business.image_url,
      is_blocked: business.is_blocked,
      is_verified: business.is_verified,
      name: business.name,
      opening_time: business.opening_time,
      owner_name: business.owner_name,
      penalty_status: business.penalty_status,
      phone: business.phone,
      tax_id: business.tax_id,
      created_at: business.created_at || new Date(),
      updated_at: new Date()
    };
  }

  /**
   * Normalización de fechas sin 'any'.
   * Maneja la transición de Timestamps de Firebase a Date nativo.
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