export interface GlobalCategory {
  id: string;
  name: string;
  icon: string;
  is_custom?: boolean;
}

export const GLOBAL_CATEGORIES: GlobalCategory[] = [
  { id: 'comida-rapida', name: 'Comida Rápida', icon: 'pi-burger' },
  { id: 'pizzas', name: 'Pizzas', icon: 'pi-map' },
  { id: 'desayunos', name: 'Desayunos', icon: 'pi-sun' },
  { id: 'almuerzos', name: 'Almuerzos', icon: 'pi-briefcase' },
  { id: 'asados', name: 'Asados', icon: 'pi-fire' },
  { id: 'comida-china', name: 'Comida China', icon: 'pi-box' },
  { id: 'comida-saludable', name: 'Comida Saludable', icon: 'pi-heart' },
  { id: 'bebidas', name: 'Bebidas', icon: 'pi-filter' },
  { id: 'postres', name: 'Postres', icon: 'pi-star' },
  { id: 'dulces', name: 'Dulces', icon: 'pi-ticket' },
  { id: 'reposteria', name: 'Repostería', icon: 'pi-palette' },
  { id: 'combos', name: 'Combos', icon: 'pi-shopping-bag' },
  { id: 'promociones-fiestas', name: 'Promociones de Fiestas', icon: 'pi-megaphone' },
  { id: 'snack-entradas', name: 'Snacks y Entradas', icon: 'pi-plus-circle' },
  { id: 'cafeteria', name: 'Cafetería', icon: 'pi-coffee' },
  { id: 'personalizada', name: 'Categoría Personalizada...', icon: 'pi-pencil', is_custom: true }
];