import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessService } from '../../../core/services/businesses/business.service';
import { OrderService } from '../../../core/services/orders/order.service';
import { Business, Order } from '../../../data/interfaces';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  // Inyección de servicios
  private readonly businessService = inject(BusinessService);
  private readonly orderService = inject(OrderService);

  /**
   * Obtiene el negocio seleccionado desde el estado global del servicio.
   * Se utiliza el signal del servicio para mantener la reactividad.
   */
  public business = this.businessService.selectedBusiness;

  /**
   * Lista de órdenes del negocio obtenida en tiempo real.
   * Se utiliza toSignal para convertir el Observable de Firestore en un Signal manejable.
   */
  private orders$ = this.orderService.getOrdersByBusiness(this.business()?.id || '');
  public orders = toSignal(this.orders$, { initialValue: [] as Order[] });

  /**
   * Calcula el número de órdenes con estado 'pending' de forma reactiva.
   */
  public pendingOrdersCount = computed(() => 
    this.orders().filter(o => o.status === 'pending').length
  );

  /**
   * Determina si el producto MVP debe ser actualizado 
   * (Lógica inicial para el recordatorio de marketing).
   */
  public needsMvpUpdate = computed(() => {
    const mvp = this.business()?.mvp_product;
    if (!mvp) return true;
    
    // El sistema evalúa si la selección es de una semana distinta a la actual
    const lastSelection = new Date(mvp.selection_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastSelection.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 7;
  });

  constructor() {}

  ngOnInit(): void {
    // El sistema verifica que exista un negocio seleccionado al cargar
    if (!this.business()) {
      console.warn('[Dashboard] No hay un negocio seleccionado en el estado global.');
    }
  }

  /**
   * Actualiza el estado de una orden (ej. de 'pending' a 'accepted').
   * Este método gatilla la actualización en Firestore y la UI reacciona automáticamente.
   */
  public async handleStatusUpdate(orderId: string, newStatus: any): Promise<void> {
    try {
      await this.orderService.updateStatus(orderId, newStatus);
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
    }
  }
}