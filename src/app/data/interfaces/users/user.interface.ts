import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;               // El ID del documento (UID de Auth)
  address: string;
  dni: string;
  email: string;           
  first_name: string;      
  image_profile: string | null;
  is_blocked: boolean;
  last_name: string;
  phone: string;
  status_multa: number;
  created_at?: Timestamp | Date; 
  updated_at?: Timestamp | Date;
}