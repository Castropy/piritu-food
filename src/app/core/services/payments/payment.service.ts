import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, where, orderBy, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Payment } from '../../../data/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly collectionName = 'payments';

  constructor(private firestore: Firestore) {}

  // Registrar un nuevo pago (Punto de venta o transferencia)
  async createPayment(payment: Payment): Promise<void> {
    const paymentsRef = collection(this.firestore, this.collectionName);
    await addDoc(paymentsRef, {
      ...payment,
      created_at: Timestamp.now()
    });
  }

  // Obtener pagos de un negocio específico (Receiver)
  getPaymentsByBusiness(businessId: string): Observable<Payment[]> {
    const paymentsRef = collection(this.firestore, this.collectionName);
    const q = query(
      paymentsRef, 
      where('receiver_id', '==', businessId),
      orderBy('created_at', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Payment[]>;
  }
}