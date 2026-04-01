import { Injectable } from '@angular/core';
import { BaseFirestoreService } from '../firestore/base-firestore.service';
import { Order, OrderStatus } from '../../../data/interfaces/orders/order.interface';
import { OrderMapper } from '../../../data/mappers/orders/order.mapper';
import { Observable } from 'rxjs';
import { where, orderBy } from '@angular/fire/firestore';

/**
 * OrderService: Gestiona el ciclo de vida completo de los pedidos en PírituFood.
 * 
 * Este servicio centraliza la creación de órdenes, el seguimiento en tiempo real 
 * para negocios y el historial para clientes. Hereda la funcionalidad base de 
 * Firestore y utiliza un mapeador especializado para asegurar la integridad de 
 * los datos transaccionales y sus marcas de tiempo.
 */
@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseFirestoreService<Order> {

  constructor() {
    // Inicializa el servicio con la colección 'orders' y su respectivo mapper
    super('orders', OrderMapper);
  }

  /**
   * Registra un nuevo pedido en el sistema iniciado por un cliente.
   * 
   * Establece el estado inicial como 'pending' y utiliza el servicio base 
   * para persistir la información, aplicando automáticamente las marcas de 
   * tiempo a través del mapper.
   */
  public async createOrder(order: Order): Promise<string> {
    const orderData: Order = {
      ...order,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date()
    };

    return this.create(orderData);
  }

  /**
   * Proporciona un flujo de datos en tiempo real de los pedidos de un negocio.
   * 
   * Filtra por el identificador del establecimiento y ordena los resultados 
   * de forma descendente por fecha de creación para el panel administrativo.
   */
  public getOrdersByBusiness(businessId: string): Observable<Order[]> {
    return this.getAll([
      where('business_id', '==', businessId),
      orderBy('created_at', 'desc')
    ]);
  }

  /**
   * Recupera el historial cronológico de pedidos realizados por un usuario.
   */
  public getOrdersByUser(userId: string): Observable<Order[]> {
    return this.getAll([
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    ]);
  }

  /**
   * Actualiza el estado logístico de un pedido específico.
   * 
   * Permite la transición entre los diferentes estados del flujo (aceptado, 
   * preparando, etc.), registrando la fecha de la última modificación.
   */
  public async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    const updateData: Partial<Order> = { 
      status,
      updated_at: new Date()
    };
    
    return this.update(orderId, updateData);
  }
}