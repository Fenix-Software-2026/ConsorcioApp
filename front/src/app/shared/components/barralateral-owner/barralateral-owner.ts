import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-barralateral-owner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './barralateral-owner.html',
  styleUrl: './barralateral-owner.css',
})
export class BarralateralOwner {

  menuItems = [

    {
      name: 'Inicio',
      icon: 'bi bi-house-door-fill',
      route: '/owner'
    },

    {
      name: 'Mis Expensas',
      icon: 'bi bi-receipt-cutoff',
      route: '/owner/mis-expensas'
   },

    {
      name: 'Mis Reclamos',
      icon: 'bi bi-tools',
      route: '/owner/mis-reclamos'
    },

    {
      name: 'Reservas',
      icon: 'bi bi-calendar-check-fill',
      route: '/owner/reservas'
    },

    {
       name:'Servicios',
       icon:'bi bi-tools',
       route:'/owner/servicios'
   },

    {
      name: 'Avisos',
      icon: 'bi bi-megaphone-fill',
      route: '/owner/avisos'
    },

    {
      name: 'Documentos',
      icon: 'bi bi-folder2-open',
      route: '/owner/documentos'
    },

    {
      name: 'Configuración',
      icon: 'bi bi-gear-fill',
      route: '/owner/configuracion'
    }

  ];

}