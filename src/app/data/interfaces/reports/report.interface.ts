import { Timestamp } from '@angular/fire/firestore';

export type ReportStatus = 'open' | 'resolved' | 'dismissed';

export interface Report {
  id?: string;
  accused_id: string;      // UID de la persona reportada
  created_at: Timestamp | Date;
  description: string;
  evidence_urls: string[]; // Array de URLs de imágenes o pruebas
  order_id: string;
  reporter_id: string;     // UID de la persona que reporta
  status: ReportStatus;
}