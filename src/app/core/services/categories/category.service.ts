import { Injectable } from '@angular/core';
import { BaseFirestoreService } from '../firestore/base-firestore.service';
import { Category } from '../../../data/interfaces';
import { CategoryMapper } from '../../../data/mappers/category/category.mapper';
import { Observable } from 'rxjs';
import { where, orderBy } from '@angular/fire/firestore';

/**
 * CategoryService: Gestiona el ciclo de vida de las categorías de menú.
 * 
 * Este servicio administra las agrupaciones de productos para cada negocio, 
 * permitiendo una organización lógica del catálogo. Hereda las capacidades 
 * CRUD del servicio base y utiliza un mapeador especializado para garantizar 
 * la integridad de los metadatos de visualización.
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseFirestoreService<Category> {

  constructor() {
    // Inicializa el servicio con la colección 'categories' y su mapper dedicado
    super('categories', CategoryMapper);
  }

  /**
   * Recupera las categorías habilitadas de un establecimiento específico.
   * 
   * Los resultados se filtran por el identificador del negocio y su estado 
   * de activación, retornándolos en el orden de visualización definido 
   * por el administrador del local.
   */
  public getCategoriesByBusiness(businessId: string): Observable<Category[]> {
    return this.getAll([
      where('business_id', '==', businessId),
      where('is_enabled', '==', true),
      orderBy('display_order', 'asc')
    ]);
  }

  /**
   * Registra una nueva categoría en el sistema.
   * 
   * Utiliza la lógica de persistencia del servicio base, la cual aplica 
   * el mapper 'toFirestore' para estandarizar las marcas de tiempo y 
   * limpiar la estructura del objeto antes de su inserción.
   */
  public async addCategory(category: Category): Promise<string> {
    return this.create({
      ...category,
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  /**
   * Actualiza los atributos de una categoría existente.
   * 
   * Permite modificaciones parciales en campos como el nombre, la descripción 
   * o el orden de prioridad, registrando automáticamente la fecha de modificación.
   */
  public async updateCategory(id: string, data: Partial<Category>): Promise<void> {
    return this.update(id, {
      ...data,
      updated_at: new Date()
    });
  }
}