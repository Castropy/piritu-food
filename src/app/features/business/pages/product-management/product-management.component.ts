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

// Dialog Service
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-product-management',
  standalone: true,
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
  
  // Corregido: Soporta null para evitar error 2322
  private ref: DynamicDialogRef | undefined | null;

  /**
   * Obtiene la lista de productos reactivamente. 
   * Gracias a la nueva estructura de rutas, este signal se mantiene vivo mientras estemos en /products.
   */
  public products = toSignal(
    this.productService.getProductsByBusiness(this.businessService.selectedBusiness()?.id || ''),
    { initialValue: [] as Product[] }
  );

  /**
   * Despliega el formulario de producto en un diálogo dinámico.
   * El sistema ahora renderiza este diálogo sobre el layout persistente del Dashboard.
   */
  public showProductForm(): void {
    this.ref = this.dialogService.open(ProductFormComponent, {
      header: 'Nuevo Producto - PírituFood',
      width: '50vw',
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      closable: true,
      modal: true, // El sistema asegura que el diálogo sea modal para mejorar la UX
      styleClass: 'custom-product-dialog'
    });

    // Corregido: Optional chaining para evitar error 2532
    this.ref?.onClose.subscribe((added: boolean) => {
      if (added) {
        console.log('El sistema detectó un nuevo producto agregado');
      }
    });
  }

  /**
   * Alterna la disponibilidad de un producto en la base de datos.
   */
  public async toggleAvailability(product: Product): Promise<void> {
    try {
      // El sistema sincroniza el estado del toggle con Firestore
      await this.productService.updateProduct(product.id!, { 
        is_enabled: product.is_enabled, // Se usa el valor actual del modelo vinculado al ngModel
      });
    } catch (error) {
      console.error('Error al cambiar disponibilidad:', error);
    }
  }

  ngOnDestroy(): void {
    // El sistema destruye la instancia del diálogo al salir del componente para evitar fugas de memoria
    if (this.ref) {
      this.ref.close();
    }
  }
}