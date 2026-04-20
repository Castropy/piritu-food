import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // 1. EL LOBBY: La puerta de entrada (Pública)
  {
    path: '',
    loadComponent: () => import('./features/lobby/lobby.component').then(m => m.LobbyComponent)
  },
  
  // 2. AUTH: Login y Registro
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth.component/auth.component').then(m => m.AuthComponent)
  },

  // 3. STORE: Exploración de productos (Pública)
  {
    path: 'store',
    loadComponent: () => import('./features/customer/store.component/store.component').then(m => m.StoreComponent)
  },

  // --- RUTAS PROTEGIDAS (Requieren Login) ---
  
  // DASHBOARD: Para los dueños de negocios
  // El sistema reestructura el Dashboard como un Layout persistente para sus rutas hijas
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/business/dashboard.component/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: '', // Ruta por defecto: /dashboard (Muestra la cola de pedidos)
        loadComponent: () => import('./features/business/orders.component/orders.component').then(m => m.OrdersComponent),
      },
      {
        path: 'products', // Ruta: /dashboard/products (Muestra la gestión de productos)
        loadComponent: () => import('./features/business/product-management/product-management.component').then(m => m.ProductManagementComponent),
      }
    ]
  },

  // ADMIN: Para el control total de PírituFood
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-panel.component/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [authGuard]
  },

  // --- MANEJO DE ERRORES ---
  
  // Si ponen una ruta que no existe, los mandamos de vuelta al Lobby
  {
    path: '**',
    redirectTo: ''
  }
];