# 🏢 Dominio: Business (Panel de Aliados) - PírituFood

Este módulo centraliza toda la experiencia de los dueños de negocios locales en la plataforma. Su objetivo es proporcionar herramientas de gestión rápidas, reactivas y fáciles de usar.

## 👑 Arquitectura: El Shell Pattern
Hemos implementado un patrón de **Feature Shell** para garantizar que la interfaz sea persistente y la navegación fluida.

- **Capitán (`business-layout`)**: Es el componente orquestador que contiene el Sidebar y el Topbar. Utiliza un `<router-outlet>` para renderizar las páginas hijas sin recargar el marco general de la aplicación.

## 📂 Estructura de Directorios

### 🛠️ `business-layout/`
Contiene el esqueleto visual del panel. Maneja el estado de la navegación y las acciones globales (como cerrar sesión).

### 📄 `pages/`
Aquí residen los componentes que representan vistas completas (rutas):
- **Dashboard**: Resumen de ventas, estado del comercio y métricas clave.
- **Orders**: Cola de pedidos en tiempo real con integración a Firebase.
- **Product Management**: Listado de inventario y control de disponibilidad.
- **Product Form**: Formulario especializado (Standalone) para crear/editar productos. Implementa `MultiSelect` de PrimeNG para una gestión de ingredientes más robusta y sin errores de tipado.

### 🧩 `components/`
Componentes de soporte reutilizables dentro de esta feature:


## 🚦 Flujo de Navegación y Rutas
El acceso a este módulo está protegido por el `authGuard`. Las rutas están definidas de forma modular en `business.routes.ts` utilizando **Lazy Loading** para optimizar el rendimiento.

- `/business/dashboard` -> Vista principal.
- `/business/orders` -> Gestión de pedidos activos.
- `/business/product-management` -> Gestión de catálogo.
- `/business/product-form` -> Formulario para crear productos.

## 🛡️ Reglas de Oro
1. **Separación de Capas**: Ningún componente de esta carpeta realiza peticiones HTTP o llamadas a Firestore directamente; siempre pasan a través del `ProductService` o `BusinessService` en la capa `core`.
2. **Reactividad**: Se prefiere el uso de **Signals** para el manejo de estados locales de la interfaz.
3. **UI/UX**: Todos los componentes deben seguir la línea estética de PírituFood: bordes redondeados (`rounded-xl`), colores naranja/gris y transiciones suaves.

---
🚀 *Desarrollado con ❤️ en Venezuela para potenciar el comercio local.*