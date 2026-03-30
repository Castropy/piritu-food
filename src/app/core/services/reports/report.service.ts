import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc, collectionData, Timestamp } from '@angular/fire/firestore';
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