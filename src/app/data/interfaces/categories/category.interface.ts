import { Timestamp } from '@angular/fire/firestore';

export interface Category {
  id: string;              // Puede ser el ID global (pizzas) o un UID de Firestore
  business_id: string;     // Obligatorio para saber de quién es
  name: string;            // Nombre visible
  description?: string;
  icon?: string;           // Icono de la constante o uno por defecto
  is_enabled: boolean;
  display_order: number;
  product_count: number;
  is_custom: boolean;      // VITAL: Para saber si es de nuestra lista o inventada
  created_at?: Timestamp | Date;
  updated_at?: Timestamp | Date;
}