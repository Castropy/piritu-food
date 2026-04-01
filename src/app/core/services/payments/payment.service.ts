import { Injectable } from '@angular/core';
import { BaseFirestoreService } from '../firestore/base-firestore.service';
import { Payment } from '../../../data/interfaces';
import { PaymentMapper } from '../../../data/mappers/payments/payment.mapper';
import { Observable } from 'rxjs';
import { where, orderBy } from '@angular/fire/firestore';

/**
 * PaymentService: Gestiona el registro y la consulta de transacciones financieras.
 * 
 * Este servicio centraliza la creación de registros de pago (transferencias, 
 * puntos de venta o efectivo) y permite a los establecimientos consultar su 
 * historial de ingresos. Hereda la funcionalidad base de Firestore y utiliza 
 * el PaymentMapper para normalizar los datos monetarios.
 */
@Injectable({
  providedIn: 'root'
})
export class PaymentService extends BaseFirestoreService<Payment> {

  constructor() {
    // Inicializa el servicio con la colección 'payments' y su mapper dedicado
    super('payments', PaymentMapper);
  }

  /**
   * Registra una nueva transacción de pago en el sistema.
   * 
   * Utiliza la lógica del servicio base para persistir el pago, asegurando 
   * que se asigne una marca de tiempo de creación y que los montos sean 
   * procesados correctamente por el mapper antes de llegar a la base de datos.
   */
  public async createPayment(payment: Payment): Promise<string> {
    return this.create({
      ...payment,
      created_at: new Date()
    });
  }

  /**
   * Recupera el historial de pagos recibidos por un negocio específico.
   * 
   * Realiza una consulta filtrada por el identificador del receptor (receiver_id) 
   * y devuelve los registros ordenados cronológicamente de forma descendente 
   * para facilitar la auditoría diaria.
   */
  public getPaymentsByBusiness(businessId: string): Observable<Payment[]> {
    return this.getAll([
      where('receiver_id', '==', businessId),
      orderBy('created_at', 'desc')
    ]);
  }
}