import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/aurh';



export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const user = authService.currentUser();

  // Revisa que esté logueado Y que su rol sea estrictamente Administrador
  if (user && user.rol === 'administrador') {
    return true; // 🟩 Sos Admin, pasá al dashboard
  }

  // Si no es admin, lo saca carpiendo al login
  console.warn('Acceso denegado: Solo Administrador.');
  router.navigate(['/login']);
  return false;
};