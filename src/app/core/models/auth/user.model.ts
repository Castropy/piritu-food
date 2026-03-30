/**
 * UserRoles: Define los tipos de acceso permitidos en el sistema.
 * Beneficio: Centralizar esto permite usarlo en Guards y Directivas de UI.
 */
export type UserRole = 'client' | 'admin' | 'business';

/**
 * UserProfile: Representa el documento del usuario en Firestore.
 * Precaución: No confundir con el 'User' genérico de Firebase Auth.
 */
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole; 
  phoneNumber?: string;
  createdAt: number;
  updatedAt?: number; // Añadimos esto para auditoría básica
}