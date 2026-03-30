export type PaymentStatus = 'pending' | 'verification' | 'confirmed' | 'rejected';

export interface Payment {
  id?: string; // Opcional para cuando manejas el ID de Firestore
  amount_paid: number;
  created_at: Date | string; // Puede ser un Date o un string dependiendo de cómo se maneje
  order_id: string;
  receipt_image_url: string;
  receiver_id: string;
  reference_number: string[];
  sender_id: string;
  status: PaymentStatus;
}