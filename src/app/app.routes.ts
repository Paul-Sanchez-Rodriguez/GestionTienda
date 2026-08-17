import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'producto/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
  {
    path: 'clientes',
    loadComponent: () =>
      import('./pages/clients/clients.component').then((m) => m.ClientsComponent),
  },
  {
    path: 'clientes/:id',
    loadComponent: () =>
      import('./pages/client-detail/client-detail.component').then(
        (m) => m.ClientDetailComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
