import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', redirectTo: 'plataforma', pathMatch: 'full'},
  {path: 'plataforma', loadComponent: () => import('./Pages/Layout/Page/layout-component/layout-component').then(m => m.LayoutComponent),
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', loadComponent: () => import('./Pages/Home/Pages/home-component/home-component').then(m => m.HomeComponent)},
      {path: 'eventos', loadComponent: () => import('./Pages/Eventos/Pages/eventos-component/eventos-component').then(m => m.EventosComponent)},
      {path: 'contacto', loadComponent: () => import('./Pages/Contacto/Pages/contacto-component/contacto-component').then(m => m.ContactoComponent)},
      {path: 'locales', loadComponent: () => import('./Pages/Locales/Pages/locales-component/locales-component').then(m => m.LocalesComponent)},
      {path: 'pedidos', loadComponent: () => import('./Pages/Pedidos/Pages/pedidos-component/pedidos-component').then((m) => m.PedidosComponent)}
    ]
  },
  {path: '**', redirectTo: '' , pathMatch: 'full'}
];
