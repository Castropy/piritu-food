import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/products/product.service';
import { BusinessService } from '../../../../core/services/businesses/business.service';
import { GLOBAL_CATEGORIES } from '../../../../core/constants/category.constants';
import { Product } from '../../../../data/interfaces';

// PrimeNG para un look pro
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ChipsModule } from 'primeng/chips';
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
    DropdownModule, 
    ChipsModule, 
    ButtonModule
  ],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private productService = inject(ProductService);
  private businessService = inject(BusinessService);
  private ref = inject(DynamicDialogRef);

  // Cargamos nuestras constantes globales
  public categories = GLOBAL_CATEGORIES;
  public isCustomCategory = false;

  public productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(0.1)]],
    category_selection: ['', [Validators.required]], // Para el dropdown
    custom_category_name: [''], // Solo se usa si eligen "Personalizada"
    ingredients: [[] as string[]],
    extras: [[] as string[]],
    image_url: [null as string | null]
  });

  ngOnInit() {
    // Escuchamos cambios en el selector de categorías
    this.productForm.get('category_selection')?.valueChanges.subscribe(value => {
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

  async onSubmit() {
    if (this.productForm.invalid) return;

    const businessId = this.businessService.selectedBusiness()?.id;
    if (!businessId) return;

    const raw = this.productForm.getRawValue();
    
    // Lógica para definir el category_id final
    const finalCategoryId = this.isCustomCategory 
      ? raw.custom_category_name 
      : raw.category_selection;

    const newProduct: Product = {
      id: '', // Firestore lo genera
      business_id: businessId,
      category_id: finalCategoryId,
      name: raw.name,
      price: raw.price,
      ingredients: raw.ingredients,
      extras: raw.extras,
      image_url: raw.image_url,
      is_enabled: true // Se crea habilitado por defecto
    };

    try {
      await this.productService.addProduct(newProduct);
      this.ref.close(true);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  }
}