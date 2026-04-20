import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'; // El sistema importa RouterOutlet para el manejo de rutas hijas
import { BusinessService } from '../../../../core/services/businesses/business.service';
import { OrderService } from '../../../../core/services/orders/order.service';
import { Order } from '../../../../data/interfaces';
import { toSignal } from '@angular/core/rxjs-interop';
import { BusinessLogicUtils } from '../../../../core/utils/businesses/business-logic.utils';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // El sistema añade RouterOutlet para permitir la inyección dinámica de componentes hijos
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  // Inyección de servicios
  private readonly businessService = inject(BusinessService);
  private readonly orderService = inject(OrderService);

  /**
   * Obtiene el negocio seleccionado desde el estado global del servicio.
   * El sistema mantiene este signal aquí para mostrar la info en el Header del Layout.
   */
  public business = this.businessService.selectedBusiness;

  /**
   * Lista de órdenes del negocio obtenida en tiempo real.
   * El sistema mantiene este stream en el Layout para alimentar los contadores globales (Stats).
   */
  private orders$ = this.orderService.getOrdersByBusiness(this.business()?.id || '');
  public orders = toSignal(this.orders$, { initialValue: [] as Order[] });

  /**
   * Calcula el número de órdenes con estado 'pending' para las cards superiores.
   */
  public pendingOrdersCount = computed(() => 
    this.orders().filter(o => o.status === 'pending').length
  );

  /**
   * Determina si el producto MVP debe ser actualizado.
   * El sistema normaliza la fecha para el recordatorio visual en el Layout.
   */
  public needsMvpUpdate = computed(() => {
    const mvp = this.business()?.mvp_product;
    if (!mvp) return true;
    
    const selectionDate = mvp.selection_date instanceof Date 
      ? mvp.selection_date 
      : (mvp.selection_date as any).toDate();

    const today = new Date();
    const diffTime = Math.abs(today.getTime() - selectionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 7;
  });

  constructor() {}

  ngOnInit(): void {
    // El sistema verifica que exista un negocio seleccionado al cargar el panel
    if (!this.business()) {
      console.warn('[Dashboard] No hay un negocio seleccionado en el estado global.');
    }
  }

  // El sistema traslada 'handleStatusUpdate' al OrdersComponent para mantener la lógica cerca de la tabla

  public businessStatus = computed(() => 
    BusinessLogicUtils.getBusinessStatus(this.business())
  );

  public isActuallyOpen = computed(() => 
    this.businessStatus() === 'open'
  );
}