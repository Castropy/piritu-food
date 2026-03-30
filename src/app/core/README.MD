Core Layer - PírituFood
Esta capa contiene la lógica de negocio global, las configuraciones del sistema y los servicios que deben persistir o estar disponibles en toda la aplicación. Es el puente directo con Firebase y el motor de seguridad de la plataforma.

📁 Estructura de Carpetas
1. /services
Contiene los servicios encargados de la comunicación con Firestore y la gestión de estados globales mediante Angular Signals.

Organización: Cada dominio (User, Business, Order, etc.) tiene su propia subcarpeta con un index.ts (Barrel File).

Regla de Oro: Los servicios aquí no deben manipular el DOM, solo gestionar datos y estados.

2. /guards
Protecciones de rutas (CanActivate). Aquí se define quién puede entrar al panel de administración, quién al de negocios y quién al área de clientes basándose en el rol del usuario autenticado.

3. /interceptors
Lógica para transformar peticiones o respuestas salientes/entrantes (ej. manejo de errores globales o inyección de tokens si fuera necesario).

4. /config
Configuraciones centrales de la aplicación, como el objeto de configuración de Firebase y constantes globales del sistema.

 Estándares de Implementación
Comunicación con Firestore
Se utiliza @angular/fire/firestore. Todos los métodos que modifican datos (addDoc, updateDoc, setDoc) deben ser async/await. Las lecturas de datos deben retornar un Observable.

Gestión de Estado (Signals)
Para evitar el "Prop Drilling" y mejorar el rendimiento, los estados críticos (Usuario actual, Negocio seleccionado) se manejan con signal y se exponen como readonly.

TypeScript
// Ejemplo de acceso en componentes
readonly user = this.userService.currentUser();
 Restricciones de la Capa
No Importar de Features: Está estrictamente prohibido importar archivos de la carpeta src/app/features/ hacia core. Esto evita dependencias circulares.

Independencia de UI: Ningún servicio de esta carpeta debe contener lógica de estilos (CSS) ni referencias directas a componentes visuales.