import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avisos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avisos.html',
  styleUrl: './avisos.css'
})
export class Avisos {
  avisos = [
    { id: 1, titulo: 'Corte programado de agua', fecha: '24/05/2026', descripcion: 'Mantenimiento general de 08:00 a 12:00 hs.', icono: 'bi bi-droplet-fill', prioridad: 'Alta' },
    { id: 2, titulo: 'Reunión de consorcio', fecha: '27/05/2026', descripcion: 'Reunión extraordinaria en el SUM a las 19:00 hs.', icono: 'bi bi-people-fill', prioridad: 'Media' },
    { id: 3, titulo: 'Mantenimiento de ascensor', fecha: '29/05/2026', descripcion: 'Técnicos realizarán controles preventivos.', icono: 'bi bi-tools', prioridad: 'Baja' }
  ];

  marcarComoLeido(aviso: any) {
    console.log(`Aviso ${aviso.id} marcado como leído en el back.`);
    // Aquí iría: this.avisosService.marcarLeido(aviso.id).subscribe(...)
  }
}