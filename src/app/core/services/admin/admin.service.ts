/* Servicio para manejar operaciones relacionadas con los administradores */
import { Injectable, signal } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Admin } from '../../../data/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Signal para tener el admin actual disponible en toda la app
  private currentAdminSignal = signal<Admin | null>(null);
  readonly currentAdmin = this.currentAdminSignal.asReadonly();

  constructor(private firestore: Firestore) {}

  /**
   * Obtiene los datos de un admin por su UID
   */
  getAdminById(uid: string): Observable<Admin> {
    const adminRef = doc(this.firestore, `admins/${uid}`);
    return docData(adminRef, { idField: 'id' }) as Observable<Admin>;
  }

  /**
   * Actualiza el perfil del admin (ej: last_login o avatar)
   */
  async updateAdmin(uid: string, data: Partial<Admin>): Promise<void> {
    const adminRef = doc(this.firestore, `admins/${uid}`);
    await updateDoc(adminRef, { ...data, updated_at: new Date() });
  }

  /**
   * Guarda el admin en el signal para acceso global
   */
  setAdmin(admin: Admin) {
    this.currentAdminSignal.set(admin);
  }
}