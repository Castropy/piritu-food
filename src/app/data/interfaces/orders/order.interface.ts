import { Timestamp } from 'firebase/firestore';

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'on_way' | 'delivered' | 'cancelled' | 'rejected';
export type ServiceType = 'pickup' | 'delivery';

export interface Order {
  id: string;               // ID del documento
  business_id: string;
  business_name: string;    
  created_at: Timestamp | Date;
  items: any[];             // Mantenemos any[] por la estructura mixta de tu capture [uid, qty]
  service_type: ServiceType;
  status: OrderStatus;
  total_price: number;
  user_id: string;
  user_name: string;        
  user_notes: string;       
}