import { Timestamp } from 'firebase/firestore';

export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

export type AdminPermission = 
  | 'manage_orders' 
  | 'manage_users' 
  | 'manage_payments' 
  | 'manage_businesses';

export interface Admin {
  id?: string;
  avatar_url: string;
  created_at: Timestamp | Date;
  email: string;
  is_active: boolean;
  last_login: Timestamp | Date;
  permissions: AdminPermission[];
  role: AdminRole;
  security_pin: string;
  updated_at: Timestamp | Date;
  user_name: string;
}