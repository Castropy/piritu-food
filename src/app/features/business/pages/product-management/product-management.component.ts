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
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';

// ✅ Importación limpia de DynamicDialog
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-product-management',
  standalone: true,
  // 💡 Ya no necesitamos 'providers: [DialogService]' aquí porque es global en app.config.ts
  imports: [
    CommonModule,  
    FormsModule,
    TableModule, 
    ToggleSwitch, 
    Button, 
    Tag,
    DynamicDialogModule, 
  ],
  templateUrl: './product-management.component.html'
})
export class ProductManagementComponent implements OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly businessService = inject(BusinessService);
  private readonly dialogService = inject(DialogService);
  
  private ref: DynamicDialogRef | undefined | null;

  /**
   * Obtiene la lista de productos reactivamente vinculada al negocio seleccionado.
   */
  public products = toSignal(
    this.productService.getProductsByBusiness(this.businessService.selectedBusiness()?.id || ''),
    { initialValue: [] as Product[] }
  );

  /**
   * Despliega el formulario de producto en un diálogo dinámico.
   */
  public showProductForm(): void {
    this.ref = this.dialogService.open(ProductFormComponent, {
      header: 'Nuevo Producto - PírituFood',
      width: '50vw',
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      closable: true,
      modal: true,
      styleClass: 'custom-product-dialog',
      // 💡 Importante: Esto asegura que el DialogService sepa dónde inyectar el componente
      appendTo: 'body' 
    });

    this.ref?.onClose.subscribe((added: boolean) => {
      if (added) {
        console.log('El sistema detectó un nuevo producto agregado');
      }
    });
  }

  /**
   * Alterna la disponibilidad de un producto sincronizando con Firestore.
   */
  public async toggleAvailability(product: Product): Promise<void> {
    try {
      await this.productService.updateProduct(product.id!, { 
        is_enabled: product.is_enabled,
      });
    } catch (error) {
      console.error('Error al cambiar disponibilidad:', error);
    }
  }

  ngOnDestroy(): void {
    // Cerramos cualquier instancia activa para evitar memory leaks
    if (this.ref) {
      this.ref.close();
    }
  }
}