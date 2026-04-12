import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/products/product.service';
import { BusinessService } from '../../../core/services/businesses/business.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../../data/interfaces';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Mis Productos</h2>
          <p class="text-gray-500 text-sm">Gestiona el inventario y disponibilidad de tu menú</p>
        </div>
        <button [routerLink]="['new']" 
                class="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm">
          + Nuevo Producto
        </button>
      </div>
      
      <div class="bg-white rounded-xl border border-gray-100 p-10 text-center">
        <p class="text-gray-400">Cargando catálogo de productos...</p>
      </div>
    </div>
  `
})
export class ProductManagementComponent {
  private readonly productService = inject(ProductService);
  private readonly businessService = inject(BusinessService);
  
  /**
   * Obtiene la lista de productos vinculados al negocio seleccionado.
   * El sistema utiliza toSignal para mantener la reactividad con Firestore.
   */
  public products = toSignal(
    this.productService.getProductsByBusiness(this.businessService.selectedBusiness()?.id || ''),
    { initialValue: [] as Product[] }
  );
}