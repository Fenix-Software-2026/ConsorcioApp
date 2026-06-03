import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css'
})
export class Reservas {
  isModalOpen = false;
  espacioSeleccionado: any = null;
  fechaSeleccionada: string = '';

  espacios = [
    { id: 1, nombre: 'SUM', icono: 'bi bi-building', horario: '08:00 - 22:00', estado: 'Disponible' },
    { id: 2, nombre: 'Parrilla', icono: 'bi bi-fire', horario: '12:00 - 23:00', estado: 'Reservado' },
    { id: 3, nombre: 'Gimnasio', icono: 'bi bi-activity', horario: '06:00 - 23:00', estado: 'Disponible' },
    { id: 4, nombre: 'Terraza', icono: 'bi bi-sun', horario: '09:00 - 22:00', estado: 'Disponible' }
  ];

  abrirModal(espacio: any) {
    this.espacioSeleccionado = espacio;
    this.isModalOpen = true;
  }

  confirmarReserva() {
    console.log("Datos para Django:", {
      espacio_id: this.espacioSeleccionado.id,
      fecha: this.fechaSeleccionada
    });
    this.isModalOpen = false;
    this.fechaSeleccionada = '';
  }
}