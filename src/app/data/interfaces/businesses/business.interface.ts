export interface Business {
  id: string;               // El ID del documento en Firestore
  address: string;
  closing_time: string;     // Formato "23:30"
  description: string;
  email: string;            // Correo de contacto del local
  gallery_urls: string[];   // El array de fotos que definimos
  image_url: string;        // Foto de perfil/logo principal
  is_blocked: boolean;      // Control administrativo
  is_verified: boolean;     // Check azul de local confiable
  name: string;             // Nombre comercial (ej: Pizzas Píritu)
  opening_time: string;     // Formato "18:00"
  owner_name: string;       // Persona responsable
  penalty_status: number;   // Tracking de faltas del negocio
  phone: string;
  tax_id: string;           // RIF o identificación fiscal
}