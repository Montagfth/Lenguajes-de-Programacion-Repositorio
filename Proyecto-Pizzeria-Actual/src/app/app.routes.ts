import { Routes } from '@angular/router';
import { authGuard } from './Guards/auth.guard';
import { adminGuard } from './Guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'plataforma/home', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./Pages/Login/login/login').then(m => m.Login) },
  { path: 'registro', loadComponent: () => import('./Pages/Login/registro/registro').then(m => m.Registro) },

  // Rutas públicas (clientes)
  {
    path: 'plataforma',
    loadComponent: () => import('./Pages/Layout/Page/layout-component/layout-component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./Pages/Home/Pages/home-component/home-component').then(m => m.HomeComponent) },
      { path: 'eventos', loadComponent: () => import('./Pages/Eventos/Pages/eventos-component/eventos-component').then(m => m.EventosComponent) },
      { path: 'contacto', loadComponent: () => import('./Pages/Contacto/Pages/contacto-component/contacto-component').then(m => m.ContactoComponent) },
      { path: 'locales', loadComponent: () => import('./Pages/Locales/Pages/locales-component/locales-component').then(m => m.LocalesComponent) },

      // Vistas de Cliente
      { path: 'productos', loadComponent: () => import('./Pages/Cliente/Productos/catalogo-productos/catalogo-productos').then(m => m.CatalogoProductos) },
      { path: 'mis-pedidos', loadComponent: () => import('./Pages/Cliente/Pedidos/mis-pedidos/mis-pedidos').then(m => m.MisPedidos), canActivate: [authGuard] },
      { path: 'mis-reservas', loadComponent: () => import('./Pages/Cliente/Reservas/mis-reservas/mis-reservas').then(m => m.MisReservas), canActivate: [authGuard] },
    ]
  },

  // Rutas de Administración (protegidas solo para admin)
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./Pages/Admin/Dashboard/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard) },
      { path: 'productos', loadComponent: () => import('./Pages/Admin/Productos/admin-productos/admin-productos').then(m => m.AdminProductos) },
      { path: 'eventos', loadComponent: () => import('./Pages/Admin/Eventos/admin-eventos/admin-eventos').then(m => m.AdminEventos) },
      { path: 'locales', loadComponent: () => import('./Pages/Admin/Locales/admin-locales/admin-locales').then(m => m.AdminLocales) },
      { path: 'usuarios', loadComponent: () => import('./Pages/Admin/Usuarios/admin-usuarios/admin-usuarios').then(m => m.AdminUsuarios) },
      { path: 'pedidos', loadComponent: () => import('./Pages/Admin/Pedidos/admin-pedidos/admin-pedidos').then(m => m.AdminPedidos) },
      { path: 'reservas', loadComponent: () => import('./Pages/Admin/Reservas/admin-reservas/admin-reservas').then(m => m.AdminReservas) },
      { path: 'mensajes', loadComponent: () => import('./Pages/Admin/Mensajes/admin-mensajes/admin-mensajes').then(m => m.AdminMensajes) },
    ]
  },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];
