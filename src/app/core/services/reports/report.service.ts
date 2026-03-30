/* ReportService: Servicio para manejar la creación y gestión de reportes 
de problemas en la aplicación.
- createReport: Método para crear un nuevo reporte en Firestore.
- updateReportStatus: Método para actualizar el estado de un reporte
 (abierto, en proceso, cerrado).
- getAllReports: Método para obtener todos los reportes desde Firestore, 
utilizado en el Admin Dashboard para monitorear y gestionar los reportes. */
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, 
  updateDoc, doc, collectionData, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ReportStatus } from '../../../data/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private firestore: Firestore) {}

  async createReport(report: Report): Promise<void> {
    const reportsRef = collection(this.firestore, 'reports');
    await addDoc(reportsRef, {
      ...report,
      created_at: Timestamp.now(),
      status: 'open' as ReportStatus
    });
  }

  // Actualizar el estado del reporte (para el Admin Dashboard)
  async updateReportStatus(reportId: string, status: ReportStatus): Promise<void> {
    const reportRef = doc(this.firestore, `reports/${reportId}`);
    await updateDoc(reportRef, { status });
  }

  getAllReports(): Observable<Report[]> {
    const reportsRef = collection(this.firestore, 'reports');
    return collectionData(reportsRef, { idField: 'id' }) as Observable<Report[]>;
  }
}