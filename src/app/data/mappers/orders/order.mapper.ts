import { Timestamp } from 'firebase/firestore';
import { Order, OrderStatus, ServiceType } from '../../interfaces';

/**
 * OrderMapper: Responsable de la transformación de pedidos.
 * 
 * Este mapper asegura que los totales sean exactos y que las fechas de 
 * auditoría (creación y actualización) estén siempre presentes y normalizadas.
 */
export class OrderMapper {

  /**
   * Transforma un documento de Firestore a la interfaz Order.
   */
  static fromFirestore(id: string, data: any): Order {
    return {
      id,
      business_id: data.business_id || '',
      business_name: data.business_name || 'Negocio PírituFood',
      created_at: this.mapDate(data.created_at),
      // Se agrega updated_at con fallback al created_at para consistencia
      updated_at: this.mapDate(data.updated_at || data.created_at),
      items: Array.isArray(data.items) ? data.items : [],
      service_type: (data.service_type as ServiceType) || 'pickup',
      status: (data.status as OrderStatus) || 'pending',
      total_price: Number(data.total_price) || 0,
      user_id: data.user_id || '',
      user_name: data.user_name || 'Cliente',
      user_notes: data.user_notes || ''
    };
  }

  /**
   * Prepara el pedido para ser persistido en Firestore.
   */
  static toFirestore(order: Order): Omit<Order, 'id'> {
    return {
      business_id: order.business_id,
      business_name: order.business_name,
      created_at: order.created_at || new Date(),
      // Se fuerza la actualización de la fecha al persistir
      updated_at: new Date(),
      items: order.items,
      service_type: order.service_type,
      status: order.status,
      total_price: order.total_price,
      user_id: order.user_id,
      user_name: order.user_name,
      user_notes: order.user_notes
    };
  }

  /**
   * Normalización estricta de fechas para reportes y logs de pedidos.
   */
  private static mapDate(date: any): Date {
    if (date instanceof Timestamp) {
      return date.toDate();
    }
    if (date instanceof Date) {
      return date;
    }
    return new Date();
  }
}