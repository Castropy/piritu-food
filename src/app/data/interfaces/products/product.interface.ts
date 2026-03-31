// ✅ CAMBIO VITAL: Importar desde @angular/fire/firestore
import { Timestamp } from '@angular/fire/firestore'; 

export interface Product {
  id: string;               
  business_id: string;      
  category_id: string;      
  extras: string[];         
  image_url: string | null; 
  ingredients: string[];    
  is_enabled: boolean;      
  name: string;             
  price: number;
  created_at?: Timestamp | Date;
  updated_at?: Timestamp | Date;
}