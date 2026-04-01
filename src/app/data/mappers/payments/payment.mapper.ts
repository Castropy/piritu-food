import { Timestamp } from 'firebase/firestore';
import { Payment, PaymentStatus } from '../../interfaces';

/**
 * PaymentMapper: Responsable de la transformación de datos de transacciones financieras.
 * 
 * Se encarga de normalizar las referencias de pago y asegurar que los montos
 * y estados de verificación sean consistentes para la auditoría administrativa.
 */
export class PaymentMapper {

  /**
   * Transforma un documento de Firestore a la interfaz Payment.
   * @param id El identificador único del documento de pago.
   * @param data Atributos del documento en la colección 'payments'.
   */
  static fromFirestore(id: string, data: Omit<Payment, 'id'>): Payment {
    return {
      id,
      amount_paid: Number(data.amount_paid) || 0,
      created_at: this.mapDate(data.created_at),
      order_id: data.order_id || '',
      receipt_image_url: data.receipt_image_url || '',
      receiver_id: data.receiver_id || '',
      // Aseguramos que sea un array para evitar errores al iterar referencias
      reference_number: Array.isArray(data.reference_number) ? data.reference_number : [],
      sender_id: data.sender_id || '',
      status: (data.status as PaymentStatus) || 'pending'
    };
  }

  /**
   * Prepara el objeto Payment para ser persistido en Firestore.
   */
  static toFirestore(payment: Payment): Omit<Payment, 'id'> {
    return {
      amount_paid: payment.amount_paid,
      created_at: payment.created_at instanceof Date ? payment.created_at : new Date(payment.created_at),
      order_id: payment.order_id,
      receipt_image_url: payment.receipt_image_url,
      receiver_id: payment.receiver_id,
      reference_number: payment.reference_number,
      sender_id: payment.sender_id,
      status: payment.status
    };
  }

  /**
   * Normalización de fechas para el registro contable.
   * Soporta Timestamp de Firebase, Date nativo y strings de fecha.
   */
  private static mapDate(date: any): Date {
    if (date instanceof Timestamp) {
      return date.toDate();
    }
    if (date instanceof Date) {
      return date;
    }
    if (typeof date === 'string') {
      const parsed = new Date(date);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    }
    return new Date();
  }
}