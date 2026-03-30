import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard'; // Importamos tu portero

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth.component/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'store',
    loadComponent: () => import('./features/customer/store.component/store.component').then(m => m.StoreComponent)
  },
  // --- RUTAS PROTEGIDAS ---
  {
    path: 'dashboard',
    loadComponent: () => import('./features/business/dashboard.component/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard] // Solo entra si está logueado
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-panel.component/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [authGuard] // Solo entra si está logueado
  },
  // -------------------------
  {
    path: '',
    redirectTo: 'store',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'store'
  }
];