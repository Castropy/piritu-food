import { Product } from "../products/product.interface";


/**
 * CartItem: Representa un producto específico dentro del carrito.
 * Incluye la cantidad y el cálculo derivado del subtotal.
 */
export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
  // Notas especiales: "Sin cebolla", "Término medio", etc.
  notes?: string; 
}

/**
 * Cart: El estado global del carrito de compras.
 * Diseñado para ser reactivo y persistente.
 */
export interface Cart {
  /**
   * ID del negocio al que pertenece el carrito.
   * PírituFood Rule: Solo se permite items de UN solo negocio a la vez
   * para evitar conflictos logísticos de delivery.
   */
  business_id: string | null;
  business_name: string | null;
  
  /**
   * Lista de productos seleccionados.
   */
  items: CartItem[];
  
  /**
   * Metadatos calculados para la UI (Badge del carrito, Totales).
   */
  total_items: number;
  total_price: number;
  
  /**
   * Fecha de la última interacción para limpieza de carritos abandonados localmente.
   */
  last_updated: number;
}