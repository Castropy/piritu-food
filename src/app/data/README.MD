Data Layer  - PírituFood
Esta capa es la única fuente de verdad para las estructuras de datos del proyecto. Su objetivo es garantizar que toda la aplicación utilice un tipado consistente y que la comunicación con fuentes externas (Firestore/APIs) sea predecible.

📁 Estructura de Carpetas
1. /interfaces
Contiene los contratos de TypeScript para cada entidad del sistema.

Misión: Definir qué campos tiene un Usuario, un Negocio o un Pedido.

Uso de Barrel Files: Todas las interfaces se exportan a través de un index.ts en la raíz de la carpeta para facilitar las importaciones masivas.

Regla: Ninguna interfaz debe contener lógica; son puramente declarativas.

2. /mappers (Próximamente )
Aquí residirá la lógica de transformación de datos.

Misión: Convertir datos crudos de Firebase (como los Arrays mixtos de las orders) en objetos de TypeScript más amigables para la UI.

Ejemplo: Un mapper que convierta un Timestamp de Firebase en un objeto Date de JavaScript automáticamente.

3. /enums
Definiciones de valores constantes que no cambian.

Ejemplo: Estados de pedidos, roles de usuario o tipos de servicio (Delivery/Pickup).

 Estándares de Tipado
Naming Convention
Interfaces: Se usa PascalCase (ej: BusinessOrder). No usamos el prefijo "I" (IOrder) siguiendo las guías de estilo modernas de Angular.

Campos: Se respeta el snake_case que viene de Firestore para evitar transformaciones innecesarias, a menos que se use un Mapper.

Tipos de Unión (Union Types)
Para estados finitos, preferimos tipos de unión sobre strings abiertos para evitar errores de escritura:

TypeScript
export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'on_way' | 'delivered' | 'cancelled' | 'rejected';
 Restricciones de la Capa
Aislamiento Total: Esta carpeta no puede importar NADA de core, features o shared. Es una capa "hoja" que solo provee definiciones al resto del mundo.

Sin Inyección de Dependencias: Aquí no existen los @Injectable. Son solo archivos de definición .ts.