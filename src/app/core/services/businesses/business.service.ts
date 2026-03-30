// Este servicio maneja todas las operaciones relacionadas con los negocios, tanto para 
// la vista de cliente como para la administración. Incluye métodos para obtener negocios, 
// actualizar su estado y mantener un negocio seleccionado para edición. 
import { Injectable, signal } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  docData, 
  query, 
  where, 
  orderBy,
  updateDoc,
  Timestamp 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Business } from '../../../data/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  // Signal para cuando el admin está editando un negocio específico
  private selectedBusinessSignal = signal<Business | null>(null);
  readonly selectedBusiness = this.selectedBusinessSignal.asReadonly();

  constructor(private firestore: Firestore) {}

  /**
   * Obtiene todos los negocios para el listado general
   */
  getAllBusinesses(): Observable<Business[]> {
    const businessRef = collection(this.firestore, 'businesses');
    const q = query(businessRef, orderBy('name', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Business[]>;
  }

  /**
   * Obtiene solo los negocios verificados y no bloqueados (Vista Cliente)
   */
  getVerifiedBusinesses(): Observable<Business[]> {
    const businessRef = collection(this.firestore, 'businesses');
    const q = query(
      businessRef, 
      where('is_verified', '==', true), 
      where('is_blocked', '==', false)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Business[]>;
  }

  /**
   * Obtiene un negocio por su ID y lo guarda en el signal
   */
  getBusinessById(id: string): Observable<Business> {
    const businessRef = doc(this.firestore, `businesses/${id}`);
    return (docData(businessRef, { idField: 'id' }) as Observable<Business>);
  }

  /**
   * Actualiza la información del negocio (ej: cambiar horario o bloquear)
   */
  async updateBusiness(id: string, data: Partial<Business>): Promise<void> {
    const businessRef = doc(this.firestore, `businesses/${id}`);
    const updateData = { ...data, updated_at: Timestamp.now() };
    await updateDoc(businessRef, updateData as any);
  }

  /**
   * Selecciona un negocio para edición en el estado global
   */
  selectBusiness(business: Business | null) {
    this.selectedBusinessSignal.set(business);
  }
}