import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const data = localStorage.getItem('usuario');

  // 1. Si no hay usuario, mandamos al login
  if (!data) {
    router.navigate(['/login']);
    return false;
  }

  const usuario = JSON.parse(data);
  const url = state.url;

  // 2. Lógica de protección por roles
  // Si intenta entrar a dashboard pero NO es administrador
  if (url.startsWith('/dashboard') && usuario.rol !== 'Administrador') {
    router.navigate(['/owner']); // Lo mandamos a su zona
    return false;
  }

  // Si intenta entrar a owner pero NO es propietario
  if (url.startsWith('/owner') && usuario.rol !== 'Propietario / Inquilino') {
    router.navigate(['/dashboard']); // Lo mandamos a admin
    return false;
  }

  return true; // Acceso permitido
};