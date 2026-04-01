import { Injectable, signal } from '@angular/core';
import { BaseFirestoreService } from '../firestore/base-firestore.service';
import { User } from '../../../data/interfaces';
import { UserMapper } from '../../../data/mappers/user/user.mapper';
import { Observable, tap } from 'rxjs';

/**
 * UserService: Gestiona la persistencia y el estado reactivo del perfil de usuario.
 * 
 * Este servicio centraliza la sincronización entre Firestore y la aplicación, 
 * manteniendo un estado global (Signal) del usuario autenticado. Hereda la 
 * funcionalidad base y utiliza el UserMapper para normalizar los perfiles.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseFirestoreService<User> {
  
  /**
   * Estado reactivo que almacena la información del perfil del usuario actual.
   * Se expone como solo lectura para proteger la integridad del estado desde los componentes.
   */
  private userSignal = signal<User | null>(null);
  public readonly currentUser = this.userSignal.asReadonly();
  
  constructor() {
    // Inicializa el servicio con la colección 'users' y su mapper dedicado
    super('users', UserMapper);
  }

  /**
   * Recupera el perfil de un usuario desde Firestore y actualiza el estado local.
   * 
   * Utiliza un pipe con 'tap' para asegurar que cualquier cambio en el 
   * documento de Firestore se refleje inmediatamente en el Signal de la aplicación.
   */
  public getUserProfile(id: string): Observable<User> {
    return this.getById(id).pipe(
      tap(user => this.userSignal.set(user))
    );
  }

  /**
   * Crea un nuevo perfil de usuario con valores iniciales por defecto.
   * 
   * Establece las propiedades de seguridad (is_blocked) y reputación (status_multa),
   * persistiendo el objeto a través del servicio base y sincronizando el estado reactivo.
   */
  public async createUserProfile(user: User): Promise<string> {
    const userData: User = {
      ...user,
      is_blocked: false,
      status_multa: 0,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Usamos 'setWithId' para asegurar que el ID de Auth coincida con el de Firestore
    await this.setWithId(user.id, userData);
    this.userSignal.set(userData);
    return user.id;
  }

  /**
   * Actualiza parcialmente la información del perfil de un usuario.
   * 
   * Realiza la modificación en Firestore y, si el usuario actualizado es el 
   * actual, sincroniza el Signal local para mantener la coherencia en la UI.
   */
  public async updateProfile(id: string, data: Partial<User>): Promise<void> {
    const updateData = { 
      ...data, 
      updated_at: new Date() 
    };
    
    await this.update(id, updateData);
    
    // Sincronización manual del Signal para cambios inmediatos sin esperar al stream
    const current = this.userSignal();
    if (current && current.id === id) {
      this.userSignal.set({ ...current, ...updateData });
    }
  }

  /**
   * Restablece el estado del usuario local, usualmente invocado durante el logout.
   */
  public clearStatus(): void {
    this.userSignal.set(null);
  }
}