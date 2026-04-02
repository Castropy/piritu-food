🍎 PírituFood - Delivery & Marketplace
PírituFood es una plataforma moderna de delivery y gestión de pedidos diseñada específicamente para la comunidad de Píritu, Portuguesa. La aplicación conecta a los comensales con los mejores locales de comida de la zona, ofreciendo una experiencia rápida, visual e intuitiva.

🛠️ Stack Tecnológico
El proyecto está construido sobre un ecosistema de alto rendimiento:

Framework: Angular 19+ (usando Standalone Components y Signals).

Estilos: Tailwind CSS para un diseño UI/UX responsivo y moderno.

Base de Datos & Auth: Firebase para gestión en tiempo real.

Testing: Vitest para pruebas unitarias ultrarrápidas.

Gestión de Estado: Angular Signals para una reactividad fina y eficiente.

🏗️ Arquitectura Modular
Hemos implementado una Arquitectura Basada en Características (Feature-Based Architecture) para garantizar la escalabilidad y el mantenimiento a largo plazo. El proyecto se organiza de la siguiente manera:

Estructura de Carpetas

src/app/

├── core/              # Singleton Services (Auth, Interceptors, Guards)

├── data/              # Interfaces, Models y Mocks de datos

├── features/          # Módulos de usuario (Lobby, Auth, Store, Dashboard)

│   ├── auth/          # Login y Registro (Cliente/Negocio)

│   ├── lobby/         # Landing page y búsqueda inicial

│   └── ...            
├── shared/            # Componentes reutilizables, Pipes y Assets comunes

│   ├── assets/        # Configuración centralizada de imágenes/iconos

│   └── components/    # Botones, Cards y Modales genéricos

Flujo de Datos
La aplicación utiliza un flujo unidireccional apoyado en Services que consumen APIs externas, exponiendo los datos a los componentes mediante Signals, lo que reduce la carga de procesamiento al evitar la detección de cambios global de Angular en tareas innecesarias.

🚀 Instalación y Uso Local
Sigue estos pasos para tener el entorno de desarrollo listo en tu máquina:

1. Requisitos Previos
Node.js: Versión 18.x o superior.

Angular CLI: npm install -g @angular/cli.

2. Clonar e Instalar

# Clonar el repositorio
git clone https://github.com/tu-usuario/piritufood.git

# Entrar a la carpeta
cd piritu-food

# Instalar dependencias
npm install

3. Correr Servidor de Desarrollo

# Iniciar la aplicación
ng serve

Navega a http://localhost:4200/. La app se recargará automáticamente al detectar cambios.

🧪 Calidad de Código
Para asegurar que nada se rompa al subir cambios, contamos con:

Pruebas Unitarias: Ejecuta npm test para correr Vitest.

Linter: Mantenemos un estándar de código limpio y consistente.

📌 Roadmap del Proyecto
[x] Estructura modular base.

[x] Landing page (Lobby) responsiva.

[x] Sistema de Autenticación dual (Cliente/Negocio).

[ ] Dashboard para dueños de locales.

[ ] Carrito de compras.

[ ] Dashboard para admin.

✉️ Contacto: castrodevsoftware@gmail.com
Equipo PírituFood – Desarrollado con ❤️ para Píritu, Portuguesa.


