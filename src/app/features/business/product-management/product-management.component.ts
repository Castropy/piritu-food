import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/products/product.service';
import { BusinessService } from '../../../core/services/businesses/business.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../../data/interfaces';

// PrimeNG v21 Components
import { TableModule } from 'primeng/table';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';

// Dialog Service
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductFormComponent } from './product-form/product-form.component';

@Component({
  selector: 'app-product-management',
  standalone: true,
  providers: [DialogService],
  imports: [
    CommonModule, 
    RouterLink, 
    FormsModule,
    TableModule, 
    ToggleSwitch, 
    Button, 
    Tag
  ],
  templateUrl: './product-management.component.html'
})
export class ProductManagementComponent {
  private readonly productService = inject(ProductService);
  private readonly businessService = inject(BusinessService);
  private readonly dialogService = inject(DialogService);
  
  // Corregido: Soporta null para evitar error 2322
  private ref: DynamicDialogRef | undefined | null;

  public products = toSignal(
    this.productService.getProductsByBusiness(this.businessService.selectedBusiness()?.id || ''),
    { initialValue: [] as Product[] }
  );

  public showProductForm(): void {
    this.ref = this.dialogService.open(ProductFormComponent, {
      header: 'Nuevo Producto - PírituFood',
      width: '50vw',
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      closable: true
    });

    // Corregido: Optional chaining para evitar error 2532
    this.ref?.onClose.subscribe((added: boolean) => {
      if (added) {
        console.log('Producto agregado');
      }
    });
  }

  public async toggleAvailability(product: Product): Promise<void> {
    try {
      await this.productService.updateProduct(product.id!, { 
        is_enabled: !product.is_enabled,
      });
    } catch (error) {
      console.error('Error al cambiar disponibilidad:', error);
    }
  }
}