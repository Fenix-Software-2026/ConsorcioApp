import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/aurh';




export const ownerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const user = authService.currentUser();

  // Revisa que esté logueado Y que su rol sea Propietario (o Vecino, según tu Django)
  if (user && user.rol === 'propietario') {
    return true; // 🟩 Sos Propietario, pasá a tu panel
  }

  console.warn('Acceso denegado: Solo Propietario.');
  router.navigate(['/login']);
  return false;
};