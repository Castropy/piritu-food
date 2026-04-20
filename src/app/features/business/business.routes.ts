import { Routes } from '@angular/router';
import { BusinessLayoutComponent } from './business-layout/business-layout.component';

export const BUSINESS_ROUTES: Routes = [
  {
    path: '',
    component: BusinessLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard.component/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/orders.component/orders.component').then((m) => m.OrdersComponent),
      },
      {
        path: 'product-management',
        loadComponent: () =>
          import('./pages/product-management/product-management.component').then(
            (m) => m.ProductManagementComponent
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];