// Se definen los tipos de unión para evitar errores de dedo
export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'on_way' | 'delivered' | 'cancelled' | 'rejected';
export type ServiceType = 'pickup' | 'delivery';

export interface OrderItem {
  product_id: string;
  qty: number;
}

export interface Order {
  id: string;               // El UID del documento
  business_id: string;
  business_name: string;    
  created_at: any;          // Timestamp de Firebase
  items: OrderItem[];       // Estructura [uid_product, cantidad]
  service_type: ServiceType; // 'pickup' o 'delivery'
  status: OrderStatus;      // 'pending', 'accepted', etc.
  total_price: number;
  user_id: string;
  user_name: string;        
  user_notes: string;       
}