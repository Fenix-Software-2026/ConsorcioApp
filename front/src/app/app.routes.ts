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

export const routes: Routes = [
  { path: '', component: Landing }, 
  { path: 'nosotros', component: AboutUs },
  { path: 'login', component: Login },
 
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [adminGuard],
    children: [
      { path: '', component: AdminHome } 
    ]
  },

  {
    path: 'owner',
    component: DashboardOwner,
    canActivate: [ownerGuard ],
    children: [
      { path: '', component: OwnerHome }
    ]
  },

  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];