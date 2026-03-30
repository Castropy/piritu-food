Features Layer  - PírituFood
Esta capa contiene los módulos funcionales de la aplicación. Cada carpeta aquí representa una "característica" o sección completa del sistema orientada a un tipo de usuario o flujo específico.

📁 Estructura de Carpetas
Basado en nuestra arquitectura, la estructura se divide por dominios de usuario:

1. /admin
Panel de control para el Super Administrador de PírituFood.

Responsabilidad: Gestión global de negocios, validación de pagos, reportes de soporte y métricas generales del sistema.

2. /auth
Flujos de acceso y registro.

Responsabilidad: Pantallas de Login (Google/Email), Registro de nuevos usuarios y recuperación de contraseñas.

3. /business
Panel dedicado para los dueños de locales (ej: Pizzas Píritu).

Responsabilidad: Gestión de su propio inventario de productos, recepción de pedidos en tiempo real y actualización de horarios de apertura/cierre.

4. /customer
La aplicación principal para el cliente final.

Responsabilidad: Exploración de negocios por categorías, armado del carrito de compras, seguimiento de pedidos y perfil del usuario.

 Estándares de Desarrollo
Lazy Loading (Carga Perezosa)
Para que la app vuele, cada feature debe cargarse solo cuando el usuario la necesita.

Regla: Cada carpeta de feature debe tener su propio archivo de rutas (ej: admin.routes.ts) que se cargue mediante loadChildren en el router principal.

Organización Interna
Dentro de cada feature (ej: features/admin/), mantenemos el orden:

/components: Piezas pequeñas y reutilizables exclusivas de esa feature.

/pages: Componentes "contenedor" que representan una pantalla completa.

/interfaces: (Opcional) Solo si son interfaces exclusivas que no pertenecen a la capa global de data.

 Restricciones de la Capa
Comunicación Mediante Core: Las features no se hablan entre sí directamente. Si la sección de customer necesita datos de un negocio, le pregunta al BusinessService en core, nunca importa nada directamente de la carpeta features/business.

Uso de Shared: Componentes comunes como botones, inputs o modales genéricos deben venir de la carpeta shared, no duplicarse dentro de cada feature.