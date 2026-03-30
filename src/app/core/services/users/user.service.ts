import { Injectable, signal } from '@angular/core';
import { 
  Firestore, 
  doc, 
  docData, 
  setDoc, 
  updateDoc, 
  Timestamp 
} from '@angular/fire/firestore';
import { Observable, tap } from 'rxjs';
import { User } from '../../../data/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Estado reactivo del usuario actual
  private userSignal = signal<User | null>(null);
  readonly currentUser = this.userSignal.asReadonly();
  
  constructor(private firestore: Firestore) {}

  /**
   * Obtiene el perfil de Firestore y lo guarda en el signal
   */
  getUserProfile(id: string): Observable<User> {
    const userRef = doc(this.firestore, `users/${id}`);
    return (docData(userRef, { idField: 'id' }) as Observable<User>).pipe(
      tap(user => this.userSignal.set(user))
    );
  }

  /**
   * Crea el perfil en Firestore basado en la estructura de la imagen
   */
  async createUserProfile(user: User): Promise<void> {
    const userRef = doc(this.firestore, `users/${user.id}`);
    const userData: User = {
      ...user,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
      is_blocked: false, // Por defecto al crear
      status_multa: 0    // Por defecto al crear
    };
    await setDoc(userRef, userData);
    this.userSignal.set(userData);
  }

  /**
   * Actualización parcial del perfil
   */
  async updateProfile(id: string, data: Partial<User>): Promise<void> {
    const userRef = doc(this.firestore, `users/${id}`);
    const updateData = { ...data, updated_at: Timestamp.now() };
    
    await updateDoc(userRef, updateData as any);
    
    // Sincronizamos el signal local
    const current = this.userSignal();
    if (current && current.id === id) {
      this.userSignal.set({ ...current, ...data, updated_at: Timestamp.now() as any });
    }
  }

  /**
   * Reset del estado (Logout)
   */
  clearStatus(): void {
    this.userSignal.set(null);
  }
}