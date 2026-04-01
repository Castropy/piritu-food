import { Timestamp } from '@angular/fire/firestore';
import { CartItem } from '../cart/cart.interface';

/**
 * Definición de los estados posibles de un pedido en PírituFood.
 */
export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'on_way' | 'delivered' | 'cancelled' | 'rejected';

/**
 * Define la modalidad de entrega del servicio.
 */
export type ServiceType = 'pickup' | 'delivery';

/**
 * Order: Representa la estructura de un pedido transaccional.
 * 
 * Esta interfaz define la relación entre el cliente, el negocio y los 
 * productos adquiridos, incluyendo metadatos de auditoría temporal.
 */
export interface Order {
  id: string;               // Identificador único del documento
  business_id: string;
  business_name: string;    
  user_id: string;
  user_name: string;        
  user_notes: string;       
  
  /**
   * Colección de productos seleccionados, basada en el modelo del carrito.
   */
  items: CartItem[]; 
  
  total_price: number;
  service_type: ServiceType;
  status: OrderStatus;
  
  /**
   * Marcas de tiempo para seguimiento y auditoría.
   */
  created_at: Date | Timestamp;
  updated_at: Date | Timestamp; 
}