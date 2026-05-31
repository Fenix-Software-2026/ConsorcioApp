import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { AboutUs } from './pages/about-us/about-us';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { DashboardOwner } from './pages/dashboard-owner/dashboard-owner';
import { AdminHome } from './pages/admin-home/admin-home';
import { OwnerHome } from './pages/owner-home/owner-home';
import { adminGuard } from './auth/guards/adminGuard';
import { ownerGuard } from './auth/guards/residenteGuard';

import { Clientes } from './pages/clientes/clientes';
import { Reclamos } from './pages/reclamos/reclamos';
import { Expensas } from './pages/expensas/expensas';
import { Configuracion } from './pages/configuracion/configuracion';
import { Servicios } from './pages/servicios/servicios';
import { Empleados } from './pages/empleados/empleados';
import { Pagos } from './pages/pagos/pagos';
import { MisExpensas } from './pages/mis-expensas/mis-expensas';
import { MisReclamos } from './pages/mis-reclamos/mis-reclamos';
import { ConfiguracionOwner } from './pages/configuracion-owner/configuracion-owner';
import { Reservas } from './pages/reservas/reservas';
import { Avisos } from './pages/avisos/avisos';
import { Documentos } from './pages/documentos/documentos';
import { ServiciosOwner } from './pages/servicios-owner/servicios-owner';
import { Confirmacion } from './pages/confirmacion/confirmacion';
import { Checkout } from './pages/checkout/checkout';

export const routes: Routes = [
  { path: '', component: Landing }, 
  { path: 'nosotros', component: AboutUs },
  { path: 'login', component: Login },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [adminGuard],
    children: [
      { path: '', component: AdminHome },
      { path: 'clientes', component: Clientes },
      { path: 'reclamos', component: Reclamos },
      { path:'expensas', component: Expensas },
      { path:'configuracion', component: Configuracion },
      { path:'servicios', component: Servicios },
      { path:'empleados', component: Empleados },
      { path:'pagos', component: Pagos } 
    ]
  },

   {
    path: 'owner',
    component: DashboardOwner,
    canActivate: [ownerGuard ],
    children: [
      { path: '', component: OwnerHome },
      { path: 'mis-expensas', component: MisExpensas },
      { path:'mis-reclamos', component: MisReclamos },
      { path:'configuracion', component: ConfiguracionOwner },
      { path:'reservas', component: Reservas },
      { path:'avisos', component: Avisos },
      { path:'documentos', component: Documentos },
      { path:'servicios', component: ServiciosOwner },
      { path:'confirmacion', component: Confirmacion },
      { path: 'checkout', component: Checkout },
    ]
  },

  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];