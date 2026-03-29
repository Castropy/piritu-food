export interface Product {
  id: string;               // El ID del documento (LI8K...)
  business_id: string;      // ID que lo vincula al local (Pizzas Píritu)
  category_id: string;      // ID de la categoría (Pizza, Burger, etc.)
  extras: string[];         // Array de extras opcionales
  image_url: string | null; 
  ingredients: string[];    // Array con la lista de ingredientes
  is_enabled: boolean;      // Para activar/desactivar plato (stock)
  name: string;             // Nombre del plato (ej: Pizza Margarita)
  price: number;            
}