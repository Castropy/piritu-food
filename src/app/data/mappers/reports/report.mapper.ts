import { Timestamp } from '@angular/fire/firestore';
import { Report, ReportStatus } from '../../interfaces';

/**
 * ReportMapper: Responsable de la transformación de reportes e incidencias.
 * 
 * Se encarga de normalizar la estructura de las evidencias y los estados 
 * del reporte, asegurando que el equipo de soporte reciba información 
 * consistente para la resolución de conflictos.
 */
export class ReportMapper {

  /**
   * Transforma un documento de Firestore a la interfaz Report.
   * @param id El identificador único del reporte generado por Firestore.
   * @param data Atributos del documento en la colección 'reports'.
   */
  static fromFirestore(id: string, data: Omit<Report, 'id'>): Report {
    return {
      id,
      accused_id: data.accused_id || '',
      created_at: this.mapDate(data.created_at),
      description: data.description || '',
      // Garantizamos un array para evitar fallos al renderizar galerías de evidencia
      evidence_urls: Array.isArray(data.evidence_urls) ? data.evidence_urls : [],
      order_id: data.order_id || '',
      reporter_id: data.reporter_id || '',
      status: (data.status as ReportStatus) || 'open'
    };
  }

  /**
   * Prepara el objeto Report para ser guardado o actualizado en Firestore.
   */
  static toFirestore(report: Report): Omit<Report, 'id'> {
    return {
      accused_id: report.accused_id,
      created_at: report.created_at || new Date(),
      description: report.description,
      evidence_urls: report.evidence_urls,
      order_id: report.order_id,
      reporter_id: report.reporter_id,
      status: report.status
    };
  }

  /**
   * Normalización de fechas utilizando el Timestamp oficial de AngularFire.
   */
  private static mapDate(date: Timestamp | Date | undefined): Date {
    if (date instanceof Timestamp) {
      return date.toDate();
    }
    if (date instanceof Date) {
      return date;
    }
    return new Date();
  }
}