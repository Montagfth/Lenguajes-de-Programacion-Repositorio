import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../Services/auth-service';
import { Router } from '@angular/router';

export const authInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = authService.getToken();

  console.log('🔐 Interceptor ejecutado');
  console.log('URL:', req.url);
  console.log('Token actual:', token ? `${token.substring(0, 20)}...` : 'No hay token');

  // Clonar la request y agregar el header de Authorization si existe el token
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('✅ Header Authorization agregado');
  } else {
    console.log('⚠️ No se agregó header Authorization (sin token)');
  }

  return next(req).pipe(
    tap(() => {
      console.log('✅ Request exitoso:', req.url);
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('❌ Error en request:', req.url, error);
      
      if (error.status === 401) {
        console.log('🚪 Token inválido o expirado, redirigiendo a login');
        // Token inválido o expirado, limpiar sesión y redirigir
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

