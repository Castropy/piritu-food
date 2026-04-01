import { Timestamp } from '@angular/fire/firestore';
import { OrderStatus, ServiceType } from './order-enums.interface'; // Si los tienes aparte
import { CartItem } from '../cart/cart.interface';


export interface Order {
  id: string;               // ID del documento en Firestore
  business_id: string;
  business_name: string;    
  user_id: string;
  user_name: string;        
  user_notes: string;       
  
  // Estructura de productos (Basada en tu CartItem para consistencia)
  items: CartItem[]; 
  
  total_price: number;
  service_type: ServiceType;
  status: OrderStatus;
  
  // Auditoría de tiempos
  created_at: Date | Timestamp;
  updated_at: Date | Timestamp; // <--- Agregado para resolver los errores del servicio
}