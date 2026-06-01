import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/aurh';




export const ownerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const user = authService.currentUser();

  // Revisar nomenclatura de roles
  if (user && user.rol === 'residente') {
    return true; // Estaba puesto para rol "propietario"
  }

  console.warn('Acceso denegado: Solo residente.');
  router.navigate(['/login']);
  return false;
};