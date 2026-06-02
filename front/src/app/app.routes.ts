import { Routes } from '@angular/router';
import { adminGuard } from './auth/guards/adminGuard';
import { ownerGuard } from './auth/guards/residenteGuard';

export const routes: Routes = [
  // Páginas Públicas
  { 
    path: '', 
    loadComponent: () => import('./pages/landing/landing').then(m => m.Landing) 
  }, 
  { 
    path: 'nosotros', 
    loadComponent: () => import('./pages/about-us/about-us').then(m => m.AboutUs) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login').then(m => m.Login) 
  },

  // Panel de Administración
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [adminGuard],
    children: [
      { 
        path: '', 
        loadComponent: () => import('./pages/admin-home/admin-home').then(m => m.AdminHome) 
      },
      { 
        path: 'clientes', 
        loadComponent: () => import('./pages/clientes/clientes').then(m => m.Clientes) 
      },
      { 
        path: 'reclamos', 
        loadComponent: () => import('./pages/reclamos/reclamos').then(m => m.Reclamos) 
      },
      { 
        path: 'expensas', 
        loadComponent: () => import('./pages/expensas/expensas').then(m => m.Expensas) 
      },
      { 
        path: 'configuracion', 
        loadComponent: () => import('./pages/configuracion/configuracion').then(m => m.Configuracion) 
      },
      { 
        path: 'servicios-admin', 
        loadComponent: () => import('./pages/servicios-admin/servicios-admin').then(m => m.ServiciosAdmin) 
      },
      { 
        path: 'empleados', 
        loadComponent: () => import('./pages/empleados/empleados').then(m => m.Empleados) 
      },
      { 
        path: 'pagos', 
        loadComponent: () => import('./pages/pagos/pagos').then(m => m.Pagos) 
      } 
    ]
  },

  // Residentes (Owner) <- Refactorizar nomenclatura luego
  {
    path: 'owner',
    loadComponent: () => import('./pages/dashboard-owner/dashboard-owner').then(m => m.DashboardOwner),
    canActivate: [ownerGuard],
    children: [
      { 
        path: '', 
        loadComponent: () => import('./pages/owner-home/owner-home').then(m => m.OwnerHome) 
      },
      { 
        path: 'mis-expensas', 
        loadComponent: () => import('./pages/mis-expensas/mis-expensas').then(m => m.MisExpensas) 
      },
      { 
        path: 'mis-reclamos', 
        loadComponent: () => import('./pages/mis-reclamos/mis-reclamos').then(m => m.MisReclamos) 
      },
      { 
        path: 'configuracion', 
        loadComponent: () => import('./pages/configuracion-owner/configuracion-owner').then(m => m.ConfiguracionOwner) 
      },
      { 
        path: 'reservas', 
        loadComponent: () => import('./pages/reservas/reservas').then(m => m.Reservas) 
      },
      { 
        path: 'avisos', 
        loadComponent: () => import('./pages/avisos/avisos').then(m => m.Avisos) 
      },
      { 
        path: 'documentos', 
        loadComponent: () => import('./pages/documentos/documentos').then(m => m.Documentos) 
      },
      { 
        path: 'servicios', 
        loadComponent: () => import('./pages/servicios-residente/servicios-residente').then(m => m.ServiciosResidente) 
      },
      { 
        path: 'confirmacion', 
        loadComponent: () => import('./pages/confirmacion/confirmacion').then(m => m.Confirmacion) 
      },
      { 
        path: 'checkout', 
        loadComponent: () => import('./pages/checkout/checkout').then(m => m.Checkout) 
      },
    ]
  },

  // Redirección
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];