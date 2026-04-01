import { Timestamp } from '@angular/fire/firestore';

/**
 * Estados permitidos para la gestión de incidentes.
 */
export type ReportStatus = 'open' | 'resolved' | 'dismissed';

/**
 * Report: Estructura para la gestión de reportes y soporte técnico.
 */
export interface Report {
  id?: string;
  accused_id: string;      // UID de la persona reportada
  reporter_id: string;     // UID de la persona que reporta
  order_id: string;
  description: string;
  evidence_urls: string[]; // Array de URLs de pruebas
  status: ReportStatus;
  
  // Auditoría de tiempos (Añadido updated_at para resolver el error)
  created_at: Date | Timestamp;
  updated_at: Date | Timestamp; 
}