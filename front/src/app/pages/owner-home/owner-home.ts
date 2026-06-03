import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-owner-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './owner-home.html',
  styleUrl: './owner-home.css'
})
export class OwnerHome {
  metricas = [
    { titulo: '$95.500', sub: 'Expensas Mes', icon: 'bi-cash-coin' },
    { titulo: '15 Junio', sub: 'Vencimiento', icon: 'bi-calendar-event' },
    { titulo: '0', sub: 'Reclamos Activos', icon: 'bi-tools' },
    { titulo: '1', sub: 'Reserva Confirmada', icon: 'bi-building-check' }
  ];
}