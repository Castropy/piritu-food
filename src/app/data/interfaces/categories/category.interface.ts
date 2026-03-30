import { Timestamp } from 'firebase/firestore';

export interface Category {
  id: string;               // El ID del documento (a2rhfo...)
  business_id: string;      // ID del negocio dueño de esta categoría
  description: string;      // "Todas las pizzas", etc.
  display_order: number;    // Para ordenar (1, 2, 3...) en la UI
  is_enabled: boolean;      // Para ocultar categorías enteras
  name: string;             // "Pizzas"
  product_count: number;    // Contador para la vista previa
  created_at?: Timestamp | Date;
  updated_at?: Timestamp | Date;
}