import { Timestamp } from 'firebase/firestore';
import { Order, OrderStatus, ServiceType } from '../../interfaces';

/**
 * OrderMapper: Responsable de la transformación de pedidos.
 * 
 * Este mapper es vital para el flujo de caja y operación, ya que normaliza
 * los estados del pedido y asegura que los totales numéricos sean exactos
 * para evitar errores en la facturación o en la vista del cliente.
 */
export class OrderMapper {

  /**
   * Transforma un documento de Firestore a la interfaz Order.
   * @param id El ID del documento del pedido.
   * @param data Atributos del pedido en Firestore.
   */
  static fromFirestore(id: string, data: Omit<Order, 'id'>): Order {
    return {
      id,
      business_id: data.business_id || '',
      business_name: data.business_name || 'Negocio PírituFood',
      created_at: this.mapDate(data.created_at),
      // Mantenemos la estructura de array mixto [uid, qty] enviada desde Firestore
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
  private static mapDate(date: Timestamp | Date | undefined): Date {
    if (date instanceof Timestamp) {
      return date.toDate();
    }
    if (date instanceof Date) {
      return date;
    }
    return new Date();
  }
}