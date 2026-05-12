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
      route: '/dashboard/owner-home'
    },

    {
      name: 'Mis Expensas',
      icon: 'bi bi-receipt-cutoff',
      route: '/dashboard/mis-expensas'
    },

    {
      name: 'Mis Reclamos',
      icon: 'bi bi-tools',
      route: '/dashboard/mis-reclamos'
    },

    {
      name: 'Reservas',
      icon: 'bi bi-calendar-check-fill',
      route: '/dashboard/reservas'
    },

    {
      name: 'Avisos',
      icon: 'bi bi-megaphone-fill',
      route: '/dashboard/avisos'
    },

    {
      name: 'Documentos',
      icon: 'bi bi-folder2-open',
      route: '/dashboard/documentos'
    },

    {
      name: 'Configuración',
      icon: 'bi bi-gear-fill',
      route: '/dashboard/configuracion'
    }

  ];

}