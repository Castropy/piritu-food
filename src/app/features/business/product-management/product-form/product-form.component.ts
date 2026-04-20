import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/products/product.service';
import { BusinessService } from '../../../../core/services/businesses/business.service';
import { GLOBAL_CATEGORIES } from '../../../../core/constants/category.constants';
import { Product } from '../../../../data/interfaces';
import { Subscription } from 'rxjs';

// Cambiamos Chips por MultiSelect que es más robusto en los tipos de la v21
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect'; // Alternativa estable
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    MultiSelectModule, // Usamos este en lugar de Chips
    ButtonModule
  ],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private productService = inject(ProductService);
  private businessService = inject(BusinessService);
  private ref = inject(DynamicDialogRef);

  private sub?: Subscription;
  public categories = GLOBAL_CATEGORIES;
  public isCustomCategory = false;

  // Lista de sugerencias para ingredientes (puedes ampliarla)
  public ingredientOptions = [
    { label: 'Queso', value: 'Queso' },
    { label: 'Salsa de Tomate', value: 'Salsa de Tomate' },
    { label: 'Jamón', value: 'Jamón' },
    { label: 'Tocineta', value: 'Tocineta' },
    { label: 'Maíz', value: 'Maíz' },
    { label: 'Champiñones', value: 'Champiñones' }
  ];

  public productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(0.1)]],
    category_selection: ['', [Validators.required]],
    custom_category_name: [''],
    ingredients: [[] as string[]], // MultiSelect manejará este array
    extras: [[] as string[]],
    image_url: [null as string | null]
  });

  ngOnInit() {
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

  public onCancel(): void {
    this.ref.close(false);
  }

  async onSubmit() {
    if (this.productForm.invalid) return;

    const businessId = this.businessService.selectedBusiness()?.id;
    if (!businessId) return;

    const raw = this.productForm.getRawValue();
    const finalCategoryId = this.isCustomCategory ? raw.custom_category_name : raw.category_selection;

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
      await this.productService.addProduct(newProduct);
      this.ref.close(true);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}