import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/products/product.service';
import { BusinessService } from '../../../../core/services/businesses/business.service';
import { GLOBAL_CATEGORIES } from '../../../../core/constants/category.constants';
import { Product } from '../../../../data/interfaces';
import { Subscription } from 'rxjs';

// PrimeNG v21 Standalone Components
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select'; 
import { Chip } from 'primeng/chip'; // El sistema importa Chips (estaba faltando)
import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    InputText, 
    InputNumber, 
    Select, 
    Chip, 
    Button
  ],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private productService = inject(ProductService);
  private businessService = inject(BusinessService);
  private ref = inject(DynamicDialogRef);

  private sub?: Subscription; // El sistema prepara la limpieza de suscripciones
  public categories = GLOBAL_CATEGORIES;
  public isCustomCategory = false;

  public productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(0.1)]],
    category_selection: ['', [Validators.required]], 
    custom_category_name: [''], 
    ingredients: [[] as string[]],
    extras: [[] as string[]],
    image_url: [null as string | null]
  });

  ngOnInit() {
    // El sistema monitorea el cambio de categoría para habilitar campos personalizados
    this.sub = this.productForm.get('category_selection')?.valueChanges.subscribe(value => {
      this.isCustomCategory = value === 'personalizada';
      const customCtrl = this.productForm.get('custom_category_name');
      
      if (this.isCustomCategory) {
        customCtrl?.setValidators([Validators.required]);
      } else {
        customCtrl?.clearValidators();
        customCtrl?.setValue('');
      }
      customCtrl?.updateValueAndValidity();
    });
  }

  /**
   * Cierra el diálogo sin realizar cambios.
   */
  public onCancel(): void {
    this.ref.close(false);
  }

  async onSubmit() {
    if (this.productForm.invalid) return;

    const businessId = this.businessService.selectedBusiness()?.id;
    if (!businessId) return;

    const raw = this.productForm.getRawValue();
    const finalCategoryId = this.isCustomCategory 
      ? raw.custom_category_name 
      : raw.category_selection;

    const newProduct: Product = {
      id: '', 
      business_id: businessId,
      category_id: finalCategoryId,
      name: raw.name,
      price: raw.price,
      ingredients: raw.ingredients,
      extras: raw.extras,
      image_url: raw.image_url,
      is_enabled: true 
    };

    try {
      // El sistema guarda el producto y retorna una señal de éxito al componente padre
      await this.productService.addProduct(newProduct);
      this.ref.close(true);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  }

  ngOnDestroy() {
    // El sistema limpia la suscripción para optimizar el rendimiento
    this.sub?.unsubscribe();
  }
}