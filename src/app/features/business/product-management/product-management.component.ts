import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/products/product.service';
import { BusinessService } from '../../../core/services/businesses/business.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../../data/interfaces';


// Importaciones de PrimeNG
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-product-management',
  standalone: true,
  // El sistema integra los módulos de PrimeNG para la gestión UI
  imports: [
    CommonModule, 
    RouterLink, 
    TableModule, 
    ToggleSwitchModule, 
    ButtonModule, 
    TagModule
  ],
  templateUrl: './product-management.component.html'
})
export class ProductManagementComponent {
  private readonly productService = inject(ProductService);
  private readonly businessService = inject(BusinessService);
  
  public products = toSignal(
    this.productService.getProductsByBusiness(this.businessService.selectedBusiness()?.id || ''),
    { initialValue: [] as Product[] }
  );

  /**
   * El sistema actualiza la disponibilidad del producto en tiempo real.
   * Permite al dueño ocultar/mostrar productos del menú del cliente.
   */
  public async toggleAvailability(product: Product): Promise<void> {
    try {
      await this.productService.updateProduct(product.id!, { 
        is_available: !product.is_available 
      });
    } catch (error) {
      console.error('Error al cambiar disponibilidad:', error);
    }
  }
}