import { Injectable } from '@angular/core';
import { BaseFirestoreService } from '../firestore/base-firestore.service';
import { Product } from '../../../data/interfaces';
import { ProductMapper } from '../../../data/mappers/products/product.mapper';
import { Observable } from 'rxjs';
import { where, orderBy } from '@angular/fire/firestore';

/**
 * ProductService: Gestiona el catálogo de productos de los establecimientos.
 * 
 * Este servicio centraliza las consultas de productos para la vista de clientes
 * y la gestión de inventario para los negocios. Hereda la funcionalidad base 
 * de Firestore y utiliza el ProductMapper para normalizar los datos del catálogo.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseFirestoreService<Product> {

  constructor() {
    // Inicializa el servicio con la colección 'products' y su mapper dedicado
    super('products', ProductMapper);
  }

  /**
   * Obtiene la totalidad de productos asociados a un negocio específico.
   * 
   * Retorna todos los artículos, independientemente de su estado de 
   * habilitación, ordenados alfabéticamente para facilitar la gestión administrativa.
   */
  public getProductsByBusiness(businessId: string): Observable<Product[]> {
    return this.getAll([
      where('business_id', '==', businessId),
      orderBy('name', 'asc')
    ]);
  }

  /**
   * Recupera únicamente los productos disponibles para la venta.
   * 
   * Filtra por el identificador del negocio y asegura que la propiedad 
   * 'is_enabled' sea verdadera, optimizando la experiencia del cliente final.
   */
  public getAvailableProductsByBusiness(businessId: string): Observable<Product[]> {
    return this.getAll([
      where('business_id', '==', businessId),
      where('is_enabled', '==', true),
      orderBy('name', 'asc')
    ]);
  }

  /**
   * Incorpora un nuevo producto al catálogo del negocio.
   * 
   * Utiliza la infraestructura del servicio base para crear el documento,
   * asignando automáticamente marcas de tiempo que el mapper procesará 
   * antes de la persistencia en Firestore.
   */
  public async addProduct(product: Product): Promise<string> {
    return this.create({
      ...product,
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  /**
   * Actualiza la información técnica o comercial de un producto existente.
   * 
   * Permite modificaciones parciales (precio, descripción, stock) y registra
   * la fecha de actualización para el control de cambios en el inventario.
   */
  public async updateProduct(id: string, data: Partial<Product>): Promise<void> {
    return this.update(id, {
      ...data,
      updated_at: new Date()
    });
  }
}