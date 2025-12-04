import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../Services/auth-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si está logueado
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Verificar si es administrador
  const usuario = authService.getUsuario();
  if (usuario?.nombre?.toLowerCase() === 'admin') {
    return true;
  }

  // Si no es admin, redirigir al home
  router.navigate(['/plataforma/home']);
  return false;
};
