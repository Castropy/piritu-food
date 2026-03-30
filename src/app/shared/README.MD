Shared Layer - PírituFood
Esta capa contiene todos los recursos reutilizables de la aplicación. Su objetivo es evitar la duplicación de código y mantener una identidad visual consistente en todos los módulos (Admin, Business, Customer).

📁 Estructura de Carpetas
1. /components
Componentes visuales "tontos" (Stateless) que reciben datos por @Input y emiten eventos por @Output.

Ejemplos: ButtonComponent, CustomInputComponent, NavbarComponent, LoadingSpinner.

Regla: No deben inyectar servicios de la capa core directamente; la lógica de datos debe ser manejada por el componente padre en la capa features.

2. /directives
Comportamientos personalizados para elementos del DOM.

Ejemplos: ClickOutsideDirective, RolesAllowedDirective (para mostrar/ocultar elementos según el rol).

3. /pipes
Transformaciones de datos rápidas para la vista (HTML).

Ejemplos: CurrencyVePipe (para formatear bolívares/dólares), RelativeTimePipe (ej: "Hace 5 min"), ShortNamePipe.

4. /models
Interfaces o clases que son puramente utilitarias para la UI y que no representan una entidad de la base de datos Firestore.

 Estándares de Diseño
Independencia
Un componente en shared debe ser como una pieza de LEGO: debe poder funcionar en cualquier lugar sin saber en qué pantalla está.

Tip: Si un componente de shared necesita saber si el usuario es Admin o Cliente para cambiar de color, pásale esa configuración como un @Input, no dejes que el componente lo decida solo.

Standalone Components
Como estamos en Angular 21, todos los componentes de shared son Standalone.

Uso: Solo importa en tu Feature el componente específico que necesites, no cargues toda la carpeta shared de golpe.

🚫 Restricciones de la Capa
Sin Lógica de Negocio: No debe haber cálculos de precios, validaciones de stock o llamadas a Firebase aquí. Eso pertenece a core o features.

Importaciones: Shared solo puede importar de data (interfaces). Nunca debe importar nada de core o features.