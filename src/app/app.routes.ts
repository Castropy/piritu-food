import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth.component/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'store',
    loadComponent: () => import('./features/customer/store.component/store.component').then(m => m.StoreComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/business/dashboard.component/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-panel.component/admin-panel.component').then(m => m.AdminPanelComponent)
  },
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