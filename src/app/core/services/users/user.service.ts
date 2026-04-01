import { Injectable, signal } from '@angular/core';
import { BaseFirestoreService } from '../firestore/base-firestore.service';
import { User } from '../../../data/interfaces/users/user.interface';
import { UserMapper } from '../../../data/mappers/user/user.mapper';
import { Observable, tap } from 'rxjs';

/**
 * UserService: Gestiona el perfil del usuario y mantiene un estado reactivo global.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseFirestoreService<User> {
  
  private userSignal = signal<User | null>(null);
  public readonly currentUser = this.userSignal.asReadonly();
  
  constructor() {
    super('users', UserMapper);
  }

  /**
   * Obtiene el perfil y sincroniza el Signal para toda la app.
   */
  public getUserProfile(id: string): Observable<User> {
    return this.getById(id).pipe(
      tap(user => this.userSignal.set(user))
    );
  }

  /**
   * Crea el perfil de usuario usando el UID de Auth como identificador único.
   */
  public async createUserProfile(user: User): Promise<string> {
    const userData: User = {
      ...user,
      is_blocked: false,
      status_multa: 0,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Invocamos create con el ID manual para evitar errores de tipado y lógica
    await this.create(userData, user.id); 
    
    this.userSignal.set(userData);
    return user.id;
  }

  /**
   * Actualiza el perfil y refresca el Signal local para coherencia inmediata en la UI.
   */
  public async updateProfile(id: string, data: Partial<User>): Promise<void> {
    const updateData = { 
      ...data, 
      updated_at: new Date() 
    };
    
    await this.update(id, updateData);
    
    const current = this.userSignal();
    if (current && current.id === id) {
      this.userSignal.set({ ...current, ...updateData } as User);
    }
  }

  /**
   * Limpia el estado del usuario (Logout).
   */
  public clearStatus(): void {
    this.userSignal.set(null);
  }
}