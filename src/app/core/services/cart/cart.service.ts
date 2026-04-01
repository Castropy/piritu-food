import { Injectable, computed, signal } from '@angular/core';
import { Cart, CartItem } from '../../../data/interfaces/cart/cart.interface';
import { Product } from '../../../data/interfaces/products/product.interface';

/**
 * CartService: Gestiona el estado reactivo del carrito de compras.
 * * Utiliza Angular Signals para una detección de cambios eficiente y
 * sincroniza el estado con LocalStorage para persistencia entre sesiones.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'piritufood_cart';

  // Estado inicial privado del carrito
  private _cart = signal<Cart>(this.loadFromStorage());

  // Signals computados para que los componentes consuman data derivada (Read-only)
  public cart = this._cart.asReadonly();
  public items = computed(() => this._cart().items);
  public totalItems = computed(() => this._cart().total_items);
  public totalPrice = computed(() => this._cart().total_price);

  constructor() {}

  /**
   * Añade un producto al carrito o incrementa su cantidad si ya existe.
   * Valida que el producto pertenezca al mismo negocio actual.
   */
  public addProduct(product: Product, quantity: number = 1): boolean {
    const currentCart = this._cart();

    // Regla de Oro: Solo un negocio a la vez
    if (currentCart.business_id && currentCart.business_id !== product.business_id) {
      return false; // El componente debería preguntar si desea vaciar el carrito
    }

    const existingItemIndex = currentCart.items.findIndex(
      item => item.product.id === product.id
    );

    let newItems = [...currentCart.items];

    if (existingItemIndex > -1) {
      // Actualizar item existente
      const item = newItems[existingItemIndex];
      const newQuantity = item.quantity + quantity;
      newItems[existingItemIndex] = {
        ...item,
        quantity: newQuantity,
        subtotal: newQuantity * product.price
      };
    } else {
      // Agregar nuevo item
      newItems.push({
        product,
        quantity,
        subtotal: quantity * product.price
      });
    }

    this.updateCartState(newItems, product.business_id, product.name); // Asumimos que name aquí es del negocio o manejamos la lógica en el componente
    return true;
  }

  /**
   * Elimina un item por completo o reduce su cantidad.
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
   * Limpia el estado del carrito por completo.
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
   * Actualiza el signal y el storage centralizando los cálculos.
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
    return stored ? JSON.parse(stored) : {
      business_id: null,
      business_name: null,
      items: [],
      total_items: 0,
      total_price: 0,
      last_updated: Date.now()
    };
  }
}