import { Timestamp } from '@angular/fire/firestore';
import { Report, ReportStatus } from '../../interfaces';

/**
 * ReportMapper: Responsable de la transformación de reportes e incidencias.
 */
export class ReportMapper {

  /**
   * Transforma un documento de Firestore a la interfaz Report.
   */
  static fromFirestore(id: string, data: any): Report {
    const createdAt = this.mapDate(data.created_at);
    return {
      id,
      accused_id: data.accused_id || '',
      reporter_id: data.reporter_id || '',
      order_id: data.order_id || '',
      description: data.description || '',
      status: (data.status as ReportStatus) || 'open',
      evidence_urls: Array.isArray(data.evidence_urls) ? data.evidence_urls : [],
      created_at: createdAt,
      // Se añade la propiedad obligatoria según la interfaz
      updated_at: this.mapDate(data.updated_at || data.created_at)
    };
  }

  /**
   * Prepara el objeto Report para ser guardado o actualizado en Firestore.
   */
  static toFirestore(report: Report): Omit<Report, 'id'> {
    return {
      accused_id: report.accused_id,
      reporter_id: report.reporter_id,
      order_id: report.order_id,
      description: report.description,
      status: report.status,
      evidence_urls: report.evidence_urls,
      created_at: report.created_at || new Date(),
      updated_at: new Date()
    };
  }

  /**
   * Normalización de fechas utilizando el Timestamp oficial de AngularFire.
   */
  private static mapDate(date: any): Date {
    if (date instanceof Timestamp) {
      return date.toDate();
    }
    if (date instanceof Date) {
      return date;
    }
    return new Date();
  }
}