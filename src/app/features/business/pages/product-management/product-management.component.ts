import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/products/product.service';
import { BusinessService } from '../../../../core/services/businesses/business.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../../../data/interfaces';

// PrimeNG v21 Components
import { TableModule } from 'primeng/table';
import { ToggleSwitch } from 'primeng/toggleswitch';

// ✅ Importación limpia: El DialogService se provee desde app.config.ts
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,  
    FormsModule,
    TableModule, 
    ToggleSwitch
    // 💡 Se eliminan Button y Tag para limpiar warnings de compilación (NG8113)
  ],
  templateUrl: './product-management.component.html'
})
export class ProductManagementComponent implements OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly businessService = inject(BusinessService);
  private readonly dialogService = inject(DialogService);
  
  private ref: DynamicDialogRef | undefined | null;

  /**
   * Obtiene la lista de productos de forma reactiva.
   */
  public products = toSignal(
    this.productService.getProductsByBusiness(this.businessService.selectedBusiness()?.id || ''),
    { initialValue: [] as Product[] }
  );

  /**
   * Abre el formulario de nuevo producto.
   * Al usar appendTo: 'body' y tener el host en el Layout, evitamos conflictos de CSS.
   */
  public showProductForm(): void {
    this.ref = this.dialogService.open(ProductFormComponent, {
      header: 'NUEVO PRODUCTO',
      width: '50vw',
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      closable: true,
      modal: true,
      styleClass: 'custom-product-dialog',
      appendTo: 'body' 
    });

    this.ref?.onClose.subscribe((added: boolean) => {
      if (added) {
        // Aquí podrías disparar un toast de éxito si lo deseas
        console.log('✅ Producto agregado exitosamente');
      }
    });
  }

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

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }
}