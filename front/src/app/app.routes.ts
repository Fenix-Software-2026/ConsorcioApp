import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { AboutUs } from './pages/about-us/about-us';


export const routes: Routes = [
  { path: 'inicio', component: Landing }, 
  { path: 'nosotros', component: AboutUs },
  { path: '**', redirectTo: '' } 
];


