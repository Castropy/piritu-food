import { Timestamp } from 'firebase/firestore';
import { User } from '../../interfaces';

/**
 * UserMapper: Responsable de la transformación de datos para la entidad Cliente (User).
 * 
 * Objetivo: Eliminar la dependencia de tipos propietarios de Firebase (como Timestamp)
 * en la capa de UI y asegurar que no existan valores 'undefined' en campos críticos.
 */
export class UserMapper {

  /**
   * Transforma el documento de Firestore a la interfaz User.
   * @param id El UID del documento.
   * @param data Datos del documento tipados mediante la interfaz, omitiendo el ID.
   */
  static fromFirestore(id: string, data: Omit<User, 'id'>): User {
    return {
      id,
      address: data.address || '',
      dni: data.dni || '',
      email: data.email || '',
      first_name: data.first_name || '',
      image_profile: data.image_profile || null,
      is_blocked: !!data.is_blocked,
      last_name: data.last_name || '',
      phone: data.phone || '',
      status_multa: data.status_multa || 0,
      created_at: this.mapDate(data.created_at),
      updated_at: data.updated_at ? this.mapDate(data.updated_at) : undefined
    };
  }

  /**
   * Prepara los datos del Usuario para persistencia, asegurando un objeto plano.
   */
  static toFirestore(user: User): Omit<User, 'id'> {
    return {
      address: user.address,
      dni: user.dni,
      email: user.email,
      first_name: user.first_name,
      image_profile: user.image_profile,
      is_blocked: user.is_blocked,
      last_name: user.last_name,
      phone: user.phone,
      status_multa: user.status_multa,
      created_at: user.created_at || new Date(),
      updated_at: new Date()
    };
  }

  /**
   * Normaliza la fecha sin usar 'any'. 
   * Acepta Timestamp de Firebase, Date nativo o undefined.
   */
  private static mapDate(date: Timestamp | Date | undefined): Date {
    if (date instanceof Timestamp) {
      return date.toDate();
    }
    if (date instanceof Date) {
      return date;
    }
    return new Date(); // Fallback seguro
  }
}