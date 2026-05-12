import { Routes } from '@angular/router';

import { Landing } from './pages/landing/landing';
import { AboutUs } from './pages/about-us/about-us';
import { Login } from './pages/login/login';

import { Dashboard } from './pages/dashboard/dashboard';
import { DashboardOwner } from './pages/dashboard-owner/dashboard-owner';

import { AdminHome } from './pages/admin-home/admin-home';
import { OwnerHome } from './pages/owner-home/owner-home';

export const routes: Routes = [

  // rutas publicas (lo que ve cualquier usuario)
  { path: 'inicio', component: Landing },
  { path: 'nosotros', component: AboutUs },
  { path: 'login', component: Login },

  // dashboard admin
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      { path: '', component: AdminHome }
    ]
  },

  //dashboard owner
  {
    path: 'owner',
    component: DashboardOwner,
    children: [
      { path: '', component: OwnerHome }
    ]
  },

  // redirecciones
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' }
];