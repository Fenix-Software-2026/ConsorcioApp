import type { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../service/aurh';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  if (token) {
    console.log(token, "soy interceptor")
    const clonedReq = req.clone({
      setHeaders: {        
        Authorization: `Bearer ${token}` 
      }
    });
    return next(clonedReq);
  }
  return next(req);
};
 
// withInterceptors([authInterceptor])  <--- SI O SI TIENE QUE ESTAR ESTA LÍNEA EN appConfig PARA QUE EL INTERCEPTOR FUNCIONE, SI NO, NO SE EJECUTARÁ NUNCA.