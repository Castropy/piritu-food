import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/orders/order.service';
import { BusinessService } from '../../../core/services/businesses/business.service';
import { Order } from '../../../data/interfaces';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styles: ``
})
export class OrdersComponent implements OnInit {
  // El sistema inyecta los servicios necesarios para la gestión de pedidos
  private readonly orderService = inject(OrderService);
  private readonly businessService = inject(BusinessService);

  /**
   * Obtiene el negocio seleccionado desde el estado global.
   */
  public business = this.businessService.selectedBusiness;

  /**
   * Lista de órdenes del negocio obtenida en tiempo real desde Firestore.
   * El sistema utiliza toSignal para mantener la reactividad sin suscripciones manuales.
   */
  private orders$ = this.orderService.getOrdersByBusiness(this.business()?.id || '');
  public orders = toSignal(this.orders$, { initialValue: [] as Order[] });

  constructor() {}

  ngOnInit(): void {
    // El sistema verifica la disponibilidad del negocio al cargar la cola de pedidos
    if (!this.business()) {
      console.warn('[Orders] No hay un negocio seleccionado para cargar pedidos.');
    }
  }

  /**
   * Actualiza el estado de una orden directamente en la base de datos.
   * El sistema permite la transición de estados (ej. 'pending' a 'accepted').
   */
  public async handleStatusUpdate(orderId: string, newStatus: any): Promise<void> {
    try {
      await this.orderService.updateStatus(orderId, newStatus);
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
    }
  }
}