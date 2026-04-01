import { Timestamp } from 'firebase/firestore';
import { Admin, AdminRole, AdminPermission } from '../../interfaces';

/**
 * AdminMapper: Especializado en la entidad Admin.
 * 
 * Por qué: El acceso administrativo requiere una estructura de permisos rígida.
 * Este mapper asegura que un Admin nunca tenga 'undefined' en sus permisos,
 * evitando brechas de seguridad en la UI del panel.
 */
export class AdminMapper {

  /**
   * Transforma el documento de la colección 'admins' a la interfaz Admin.
   * @param id UID del administrador (procedente de Auth).
   * @param data Datos crudos de la base de datos.
   */
  static fromFirestore(id: string, data: Omit<Admin, 'id'>): Admin {
    return {
      id,
      avatar_url: data.avatar_url || 'assets/images/default-admin.png',
      created_at: this.mapDate(data.created_at),
      email: data.email || '',
      is_active: !!data.is_active,
      last_login: this.mapDate(data.last_login),
      // Garantizamos que sea un array para poder usar .includes() en los Guards
      permissions: (data.permissions as AdminPermission[]) || [],
      role: (data.role as AdminRole) || 'viewer',
      security_pin: data.security_pin || '',
      updated_at: this.mapDate(data.updated_at),
      user_name: data.user_name || 'Admin'
    };
  }

  /**
   * Prepara los datos del Administrador para persistencia.
   */
  static toFirestore(admin: Admin): Omit<Admin, 'id'> {
    return {
      avatar_url: admin.avatar_url,
      created_at: admin.created_at || new Date(),
      email: admin.email,
      is_active: admin.is_active,
      last_login: admin.last_login || new Date(),
      permissions: admin.permissions,
      role: admin.role,
      security_pin: admin.security_pin,
      updated_at: new Date(),
      user_name: admin.user_name
    };
  }

  /**
   * Normalización estricta de fechas (Timestamp | Date | undefined).
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