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
  
  // BUSINESS: Usamos el nuevo sistema de rutas hijas cargadas por Lazy Loading
  {
    path: 'business',
    canActivate: [authGuard],
    loadChildren: () => import('./features/business/business.routes').then(m => m.BUSINESS_ROUTES)
  },

  // ADMIN: Para el control total de PírituFood
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-panel.component/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [authGuard]
  },

  // --- MANEJO DE ERRORES ---
  {
    path: '**',
    redirectTo: ''
  }
];