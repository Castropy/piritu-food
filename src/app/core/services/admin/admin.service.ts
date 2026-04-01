import { Injectable, signal } from '@angular/core';
import { BaseFirestoreService } from '../firestore/base-firestore.service';
import { Admin } from '../../../data/interfaces';
import { AdminMapper } from '../../../data/mappers/admin/admin.mapper';
import { Observable } from 'rxjs';

/**
 * AdminService: Gestiona las operaciones de los administradores de la plataforma.
 * Hereda de BaseFirestoreService para aprovechar el CRUD genérico y el Mapper.
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseFirestoreService<Admin> {
  
  // Signal para mantener el estado del administrador actual de forma reactiva
  private currentAdminSignal = signal<Admin | null>(null);
  public readonly currentAdmin = this.currentAdminSignal.asReadonly();

  constructor() {
    // Inicializamos el servicio base con el path 'admins' y su mapper
    super('admins', AdminMapper);
  }

  /**
   * Obtiene los datos de un administrador por su UID.
   * Sobrescribimos el nombre para mantener la semántica de tu servicio original.
   */
  public getAdminById(uid: string): Observable<Admin> {
    return this.getById(uid);
  }

  /**
   * Actualiza el perfil del administrador (ej: last_login, avatar).
   * El BaseFirestoreService ya maneja la actualización parcial.
   */
  public async updateAdmin(uid: string, data: Partial<Admin>): Promise<void> {
    // Añadimos la fecha de actualización antes de enviar al servicio base
    return this.update(uid, { ...data, updated_at: new Date() });
  }

  /**
   * Establece el administrador activo en el Signal global.
   */
  public setAdmin(admin: Admin): void {
    this.currentAdminSignal.set(admin);
  }

  /**
   * Limpia el estado del administrador (útil para el logout).
   */
  public clearAdmin(): void {
    this.currentAdminSignal.set(null);
  }
}