import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-barralateral',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './barralateral.html',
  styleUrl: './barralateral.css',
})
export class Barralateral {

  menuItems = [
    {
      name: 'Dashboard',
      icon: 'fa-solid fa-chart-line',
      route: '/dashboard'
    },
    {
      name: 'Clientes',
      icon: 'fa-solid fa-users',
      route: '/dashboard/clientes'
    },
    {
      name: 'Reclamos',
      icon: 'fa-solid fa-circle-exclamation',
      route: '/dashboard/reclamos'
    },
    {
      name: 'Expensas',
      icon: 'fa-solid fa-file-invoice-dollar',
      route: '/dashboard/expensas'
    },
    {
      name: 'Servicios',
      icon: 'fa-solid fa-screwdriver-wrench',
      route: '/dashboard/servicios'
    },
    {
      name: 'Empleados',
      icon: 'fa-solid fa-user-tie',
      route: '/dashboard/empleados'
    },
    {
      name: 'Pagos',
      icon: 'fa-solid fa-credit-card',
      route: '/dashboard/pagos'
    },
    {
      name: 'Configuración',
      icon: 'fa-solid fa-gear',
      route: '/dashboard/configuracion'
    }
  ];

}