import { Injectable } from '@angular/core';
import { BaseFirestoreService } from '../firestore/base-firestore.service';
import { Report, ReportStatus } from '../../../data/interfaces';
import { ReportMapper } from '../../../data/mappers/reports/report.mapper';
import { Observable } from 'rxjs';
import { orderBy } from '@angular/fire/firestore';

/**
 * ReportService: Gestiona el ciclo de vida de los reportes de incidentes.
 * 
 * Este servicio permite a los usuarios notificar problemas y a los 
 * administradores gestionar su resolución. Hereda la funcionalidad 
 * de Firestore y utiliza el ReportMapper para normalizar los metadatos 
 * de soporte y auditoría.
 */
@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseFirestoreService<Report> {

  constructor() {
    // Inicializa el servicio con la colección 'reports' y su mapper dedicado
    super('reports', ReportMapper);
  }

  /**
   * Registra un nuevo reporte de incidencia en el sistema.
   * 
   * Establece el estado inicial como 'open' y utiliza el servicio base 
   * para persistir la información, delegando al mapper la gestión de 
   * las marcas de tiempo y la limpieza del objeto.
   */
  public async createReport(report: Report): Promise<string> {
    return this.create({
      ...report,
      status: 'open',
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  /**
   * Actualiza el estado administrativo de un reporte específico.
   * 
   * Permite transicionar el reporte entre estados (abierto, en proceso, cerrado), 
   * registrando automáticamente la fecha de la última modificación para el 
   * seguimiento del ANS (Acuerdo de Nivel de Servicio).
   */
  public async updateReportStatus(reportId: string, status: ReportStatus): Promise<void> {
    return this.update(reportId, { 
      status,
      updated_at: new Date()
    });
  }

  /**
   * Recupera la totalidad de los reportes para su gestión centralizada.
   * 
   * Retorna un flujo de datos ordenado por fecha de creación descendente, 
   * asegurando que los incidentes más recientes aparezcan primero en el 
   * panel de administración.
   */
  public getAllReports(): Observable<Report[]> {
    return this.getAll([orderBy('created_at', 'desc')]);
  }
}