import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/aurh';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getAccessToken();
  const router = inject(Router);

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq).pipe(
      catchError(err => {
        if (err.status === 401) {
          console.warn('⚠️ Token vencido (401). Redireccionando al login...');
          authService.logout(); // Limpiamos cualquier estado de autenticación
          router.navigate(['/login']);

        }
        return throwError(() => err);
      })
    );
  }
  return next(req);
};

// withInterceptors([authInterceptor])  <--- SI O SI TIENE QUE ESTAR ESTA LÍNEA EN appConfig PARA QUE EL INTERCEPTOR FUNCIONE, SI NO, NO SE EJECUTARÁ NUNCA.