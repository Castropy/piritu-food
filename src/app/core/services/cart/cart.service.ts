import { Injectable, computed, signal, inject } from '@angular/core';
import { Cart, CartItem } from '../../../data/interfaces/cart/cart.interface';
import { Product } from '../../../data/interfaces/products/product.interface';
import { CartMapper } from '../../../data/mappers/cart/cart.mapper';

/**
 * CartService: Gestiona el estado reactivo del carrito de compras del usuario.
 * 
 * Este servicio implementa un flujo de datos basado en Angular Signals para 
 * garantizar actualizaciones instantáneas en la interfaz. Además, asegura la 
 * persistencia local mediante el uso de LocalStorage, permitiendo que la 
 * selección de productos sobreviva a recargas del navegador.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'piritufood_cart';

  /**
   * Estado privado del carrito cargado desde el almacenamiento local.
   */
  private _cart = signal<Cart>(this.loadFromStorage());

  /**
   * Exposición de señales computadas y de solo lectura para el consumo de componentes.
   */
  public cart = this._cart.asReadonly();
  public items = computed(() => this._cart().items);
  public totalItems = computed(() => this._cart().total_items);
  public totalPrice = computed(() => this._cart().total_price);

  constructor() {}

  /**
   * Incorpora un producto al carrito de compras.
   * 
   * Valida que el producto pertenezca al mismo establecimiento comercial que 
   * los items existentes. Si el producto ya se encuentra en el carrito, 
   * incrementa su cantidad; de lo contrario, utiliza el CartMapper para 
   * generar una nueva entrada tipada.
   */
  public addProduct(product: Product, quantity: number = 1): boolean {
    const currentCart = this._cart();

    // Validación de integridad: No se permite mezclar productos de diferentes negocios
    if (currentCart.business_id && currentCart.business_id !== product.business_id) {
      return false; 
    }

    const existingItemIndex = currentCart.items.findIndex(
      item => item.product.id === product.id
    );

    let newItems = [...currentCart.items];

    if (existingItemIndex > -1) {
      // Actualiza un registro existente mediante la lógica del Mapper
      newItems[existingItemIndex] = CartMapper.updateQuantity(
        newItems[existingItemIndex], 
        newItems[existingItemIndex].quantity + quantity
      );
    } else {
      // Crea un nuevo item de carrito delegando el cálculo al Mapper
      newItems.push(CartMapper.toCartItem(product, quantity));
    }

    this.updateCartState(newItems, product.business_id, 'Negocio'); // El nombre del negocio debe venir del contexto o producto
    return true;
  }

  /**
   * Remueve un producto específico del carrito basándose en su identificador único.
   */
  public removeItem(productId: string): void {
    const currentCart = this._cart();
    const newItems = currentCart.items.filter(item => item.product.id !== productId);
    
    if (newItems.length === 0) {
      this.clearCart();
    } else {
      this.updateCartState(newItems, currentCart.business_id, currentCart.business_name);
    }
  }

  /**
   * Restablece el estado del carrito a su configuración inicial vacía.
   */
  public clearCart(): void {
    const emptyCart: Cart = {
      business_id: null,
      business_name: null,
      items: [],
      total_items: 0,
      total_price: 0,
      last_updated: Date.now()
    };
    this._cart.set(emptyCart);
    this.saveToStorage(emptyCart);
  }

  /**
   * Centraliza la actualización del estado reactivo y la persistencia en disco.
   * Calcula de forma automática los totales y subtotales del carrito global.
   */
  private updateCartState(items: CartItem[], bizId: string | null, bizName: string | null): void {
    const total_items = items.reduce((acc, item) => acc + item.quantity, 0);
    const total_price = items.reduce((acc, item) => acc + item.subtotal, 0);

    const updatedCart: Cart = {
      business_id: bizId,
      business_name: bizName,
      items,
      total_items,
      total_price,
      last_updated: Date.now()
    };

    this._cart.set(updatedCart);
    this.saveToStorage(updatedCart);
  }

  private saveToStorage(cart: Cart): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
  }

  private loadFromStorage(): Cart {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    try {
      return stored ? JSON.parse(stored) : this.getEmptyCart();
    } catch (e) {
      return this.getEmptyCart();
    }
  }

  private getEmptyCart(): Cart {
    return {
      business_id: null,
      business_name: null,
      items: [],
      total_items: 0,
      total_price: 0,
      last_updated: Date.now()
    };
  }
}