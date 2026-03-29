export interface User {
  id: string;              // El UID que genera Firebase Auth
  address: string;
  dni: string;
  email: string;           
  first_name: string;      
  image_profile: string | null;
  is_blocked: boolean;
  last_name: string;
  phone: string;
  status_multa: number;    
}