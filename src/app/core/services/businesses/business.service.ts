import { Injectable, signal } from '@angular/core';
import { BaseFirestoreService } from '../firestore/base-firestore.service';
import { Business } from '../../../data/interfaces';
import { BusinessMapper } from '../../../data/mappers/business/business.mapper';
import { Observable } from 'rxjs';
import { orderBy, where } from '@angular/fire/firestore';

/**
 * BusinessService: Gestiona todas las operaciones relacionadas con los negocios.
 * * Este servicio centraliza la lógica para la visualización de clientes, 
 * el panel de administración y la gestión de estados de verificación. 
 * Hereda la funcionalidad CRUD genérica del servicio base de Firestore.
 */
@Injectable({
  providedIn: 'root'
})
export class BusinessService extends BaseFirestoreService<Business> {
  
  /**
   * Mantiene el estado del negocio seleccionado actualmente para tareas 
   * de edición o visualización detallada en el panel administrativo.
   */
  private selectedBusinessSignal = signal<Business | null>(null);
  public readonly selectedBusiness = this.selectedBusinessSignal.asReadonly();

  constructor() {
    // Inicializa el servicio base con la colección 'businesses' y su mapper respectivo
    super('businesses', BusinessMapper);
  }

  /**
   * Obtiene la totalidad de los negocios registrados, ordenados alfabéticamente por nombre.
   */
  public getAllBusinesses(): Observable<Business[]> {
    return this.getAll([orderBy('name', 'asc')]);
  }

  /**
   * Recupera únicamente los negocios que han superado el proceso de verificación 
   * y que no se encuentran bajo bloqueo administrativo.
   */
  public getVerifiedBusinesses(): Observable<Business[]> {
    return this.getAll([
      where('is_verified', '==', true),
      where('is_blocked', '==', false),
      orderBy('name', 'asc')
    ]);
  }

  /**
   * Consulta la información de un negocio específico mediante su identificador único.
   */
  public getBusinessById(id: string): Observable<Business> {
    return this.getById(id);
  }

  /**
   * Realiza actualizaciones parciales en la información de un negocio.
   * El método asegura que la propiedad de actualización se registre correctamente.
   */
  public async updateBusiness(id: string, data: Partial<Business>): Promise<void> {
    return this.update(id, { 
      ...data, 
      updated_at: new Date() // El mapper se encargará de la conversión final
    });
  }

  /**
   * Actualiza el producto destacado (MVP) del negocio.
   * Este método persiste la información denormalizada del producto seleccionado
   * para optimizar las consultas en el perfil público del establecimiento.
   */
  public async setMvpProduct(businessId: string, mvpData: Business['mvp_product']): Promise<void> {
    return this.update(businessId, {
      mvp_product: mvpData,
      updated_at: new Date()
    });
  }

  /**
   * Almacena temporalmente un objeto de tipo Business en el estado global 
   * para facilitar la comunicación entre componentes de edición.
   */
  public selectBusiness(business: Business | null): void {
    this.selectedBusinessSignal.set(business);
  }
}