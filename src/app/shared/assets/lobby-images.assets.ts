/**
 * LOBBY_IMAGES: Centralización de recursos visuales del Lobby y Auth.
 * 
 * Se utiliza una ruta base para evitar repetir el path en los componentes.
 */
const LOBBY_BASE_PATH = 'images/lobby/';

export const LOBBY_IMAGES: string[] = [
  'bat_fresa.webp', 
  'cachapa.webp', 
  'empanadas.webp', 
  'grill.webp', 
  'hamburguesa.webp', 
  'hand_burguer.webp', 
  'hot_dogs.webp', 
  'pabellon.webp', 
  'papitas.webp', 
  'parrilla.webp', 
  'pasticho.webp', 
  'pizza.webp', 
  'pollo_asado.webp'
].map(image => `${LOBBY_BASE_PATH}${image}`);