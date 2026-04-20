import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; // ✅ Necesario para el routerLink del HTML
import { ProductService } from '../../../../core/services/products/product.service';
import { BusinessService } from '../../../../core/services/businesses/business.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../../../data/interfaces';

// PrimeNG v21 Components
import { TableModule } from 'primeng/table';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,  
    FormsModule,
    RouterLink, // ✅ Añadido para habilitar la navegación desde el template
    TableModule, 
    ToggleSwitch
  ],
  templateUrl: './product-management.component.html'
})
export class ProductManagementComponent {
  private readonly productService = inject(ProductService);
  private readonly businessService = inject(BusinessService);
  
  /**
   * Obtiene la lista de productos de forma reactiva.
   */
  public products = toSignal(
    this.productService.getProductsByBusiness(this.businessService.selectedBusiness()?.id || ''),
    { initialValue: [] as Product[] }
  );

  /**
   * Actualiza el estado de disponibilidad en Firestore.
   */
  public async toggleAvailability(product: Product): Promise<void> {
    try {
      await this.productService.updateProduct(product.id!, { 
        is_enabled: product.is_enabled,
      });
    } catch (error) {
      console.error('❌ Error al actualizar disponibilidad:', error);
    }
  }

  // ✅ Se eliminó showProductForm y ngOnDestroy ya que no hay referencias de diálogo que limpiar
}