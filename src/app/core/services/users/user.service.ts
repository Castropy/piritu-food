import { Injectable, signal } from '@angular/core';
import { BaseFirestoreService } from '../firestore/base-firestore.service';
import { User } from '../../../data/interfaces/users/user.interface';
import { UserMapper } from '../../../data/mappers/user/user.mapper';
import { Observable, tap } from 'rxjs';

/**
 * UserService: Gestiona la persistencia y el estado reactivo del perfil de usuario.
 * 
 * Este servicio sincroniza los datos de Firestore con un Signal global para
 * que toda la aplicación tenga acceso al perfil del usuario autenticado en
 * tiempo real. Hereda del servicio base y utiliza el UserMapper para normalizar datos.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseFirestoreService<User> {
  
  /**
   * Signal privado para el estado del usuario.
   * Se expone como readonly para mantener la unidireccionalidad de los datos.
   */
  private userSignal = signal<User | null>(null);
  public readonly currentUser = this.userSignal.asReadonly();
  
  constructor() {
    // Inicializa con la colección 'users' y su mapper
    super('users', UserMapper);
  }

  /**
   * Obtiene el perfil de un usuario por su ID y actualiza el Signal local.
   */
  public getUserProfile(id: string): Observable<User> {
    return this.getById(id).pipe(
      tap(user => this.userSignal.set(user))
    );
  }

  /**
   * Crea un nuevo perfil de usuario en Firestore.
   * 
   * Nota: Utilizamos el método 'create' del BaseFirestoreService. 
   * Si el BaseFirestoreService no acepta un ID manual en 'create', 
   * se debe asegurar de que la implementación del padre use setDoc internamente.
   */
  public async createUserProfile(user: User): Promise<string> {
    const userData: User = {
      ...user,
      is_blocked: false,
      status_multa: 0,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Si tu BaseFirestoreService usa 'create' con un segundo parámetro para el ID:
    await this.create(userData, user.id); 
    
    this.userSignal.set(userData);
    return user.id;
  }

  /**
   * Actualiza los datos del perfil y sincroniza el estado reactivo.
   */
  public async updateProfile(id: string, data: Partial<User>): Promise<void> {
    const updateData = { 
      ...data, 
      updated_at: new Date() 
    };
    
    await this.update(id, updateData);
    
    const current = this.userSignal();
    if (current && current.id === id) {
      // Fusionamos el estado actual con los nuevos cambios
      this.userSignal.set({ ...current, ...updateData } as User);
    }
  }

  /**
   * Limpia el estado del usuario (útil para el logout).
   */
  public clearStatus(): void {
    this.userSignal.set(null);
  }
}