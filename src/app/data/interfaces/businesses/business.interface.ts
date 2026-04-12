import { Timestamp } from 'firebase/firestore';

export interface Business {
  id: string;               // El ID del documento en Firestore
  address: string;
  closing_time: string;     // Formato "23:30"
  description: string;
  email: string;           
  gallery_urls: string[];   // Array de fotos
  image_url: string;        // Foto principal/logo
  is_blocked: boolean;      
  is_verified: boolean;     
  name: string;             
  opening_time: string;     
  owner_name: string;       
  penalty_status: number;   
  phone: string;
  tax_id: string;   
  force_close: boolean;   
  /**
   * MVP: Producto destacado de la semana.
   * Denormalizado para evitar lecturas extra.
   */
  mvp_product?: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    selection_date: Timestamp | Date;
  } | null;     
  created_at?: Timestamp | Date;
  updated_at?: Timestamp | Date;
}