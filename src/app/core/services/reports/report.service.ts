import { Injectable } from '@angular/core';
import { BaseFirestoreService } from '../firestore/base-firestore.service';
import { Report, ReportStatus } from '../../../data/interfaces/reports/report.interface';
import { ReportMapper } from '../../../data/mappers/reports/report.mapper';
import { Observable } from 'rxjs';
import { orderBy } from '@angular/fire/firestore';

/**
 * ReportService: Gestiona el ciclo de vida de los reportes de incidentes.
 * 
 * Este servicio permite registrar quejas y gestionar su resolución desde el 
 * panel administrativo. Hereda de BaseFirestoreService para centralizar la 
 * persistencia y utiliza un mapper para normalizar los datos.
 */
@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseFirestoreService<Report> {

  constructor() {
    // Inicializa el servicio con la colección 'reports' y su mapper
    super('reports', ReportMapper);
  }

  /**
   * Registra un nuevo reporte en la base de datos.
   * 
   * Asigna automáticamente el estado inicial 'open' y las marcas de tiempo 
   * de creación y actualización.
   */
  public async createReport(report: Report): Promise<string> {
    const reportData: Report = {
      ...report,
      status: 'open',
      created_at: new Date(),
      updated_at: new Date()
    };

    return this.create(reportData);
  }

  /**
   * Actualiza el estado de un reporte (ej. de 'open' a 'resolved').
   * 
   * El método asegura que se registre la fecha exacta del cambio de estado.
   */
  public async updateReportStatus(reportId: string, status: ReportStatus): Promise<void> {
    const updateData: Partial<Report> = { 
      status,
      updated_at: new Date()
    };
    
    return this.update(reportId, updateData);
  }

  /**
   * Recupera todos los reportes ordenados por fecha de creación.
   */
  public getAllReports(): Observable<Report[]> {
    return this.getAll([orderBy('created_at', 'desc')]);
  }
}