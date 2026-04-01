import { CartItem } from '../../interfaces/cart/cart.interface';
import { Product } from '../../interfaces/products/product.interface';

/**
 * CartMapper: Responsable de transformar productos en items de carrito.
 * 
 * Por qué: Desacopla la estructura del producto de la lógica transaccional 
 * del carrito, permitiendo añadir metadatos como cantidades y notas 
 * de forma estandarizada.
 */
export class CartMapper {

  /**
   * Transforma un objeto Product en un objeto CartItem inicial.
   * @param product El producto seleccionado por el usuario.
   * @param quantity Cantidad inicial (por defecto 1).
   * @param notes Notas opcionales del cliente.
   */
  static toCartItem(product: Product, quantity: number = 1, notes: string = ''): CartItem {
    return {
      product: { ...product }, // Clonamos para evitar mutaciones accidentales
      quantity: Math.max(1, quantity), // Aseguramos mínimo 1
      subtotal: product.price * Math.max(1, quantity),
      notes: notes.trim()
    };
  }

  /**
   * Recalcula un item existente con una nueva cantidad.
   * Útil para los selectores de cantidad (+/-) en la UI del carrito.
   */
  static updateQuantity(item: CartItem, newQuantity: number): CartItem {
    const validQuantity = Math.max(1, newQuantity);
    return {
      ...item,
      quantity: validQuantity,
      subtotal: item.product.price * validQuantity
    };
  }
}