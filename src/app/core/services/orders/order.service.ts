/* este servicio se encarga de manejar todas las operaciones relacionadas con los pedidos, 
como crear un nuevo pedido, obtener pedidos por negocio o usuario, 
y actualizar el estado del pedido. 
Utiliza Firestore para almacenar y recuperar los datos de los pedidos en tiempo real. */

import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  collectionData,
  doc,
  updateDoc,
  Timestamp 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../../../data/interfaces'; // Barrel import

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly collectionName = 'orders';

  constructor(private firestore: Firestore) {}

  /**
   * Crea un nuevo pedido desde la App del Cliente
   */
  async createOrder(order: Omit<Order, 'id'>): Promise<void> {
    const ordersRef = collection(this.firestore, this.collectionName);
    await addDoc(ordersRef, {
      ...order,
      created_at: Timestamp.now(),
      status: 'pending' as OrderStatus
    });
  }

  /**
   * Escucha los pedidos en tiempo real para un negocio (Panel de Admin/Negocio)
   */
  getOrdersByBusiness(businessId: string): Observable<Order[]> {
    const ordersRef = collection(this.firestore, this.collectionName);
    const q = query(
      ordersRef, 
      where('business_id', '==', businessId),
      orderBy('created_at', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  /**
   * Obtiene el historial de pedidos de un usuario específico
   */
  getOrdersByUser(userId: string): Observable<Order[]> {
    const ordersRef = collection(this.firestore, this.collectionName);
    const q = query(
      ordersRef, 
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  /**
   * Cambia el estado del pedido (Aceptar, Preparando, En camino, etc.)
   */
  async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    const orderRef = doc(this.firestore, `${this.collectionName}/${orderId}`);
    await updateDoc(orderRef, { status });
  }
}