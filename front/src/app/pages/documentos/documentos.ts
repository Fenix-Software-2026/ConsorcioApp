import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documentos.html',
  styleUrl: './documentos.css'
})
export class Documentos {
  // Ahora cada documento tiene una categoría para filtros futuros
  documentos = [
    { nombre: 'Reglamento del Consorcio', tipo: 'PDF', fecha: '20/05/2026', icono: 'bi bi-file-earmark-pdf-fill', cat: 'Legal' },
    { nombre: 'Expensas Mayo 2026', tipo: 'PDF', fecha: '18/05/2026', icono: 'bi bi-receipt', cat: 'Finanzas' },
    { nombre: 'Acta Reunión General', tipo: 'DOC', fecha: '15/05/2026', icono: 'bi bi-file-earmark-text-fill', cat: 'Actas' },
    { nombre: 'Normas de Seguridad', tipo: 'PDF', fecha: '12/05/2026', icono: 'bi bi-shield-check', cat: 'Legal' }
  ];

  descargar(doc: any) {
    console.log(`Iniciando descarga de: ${doc.nombre}`);
    // Aquí irá la lógica para llamar a tu API de Django/Media files
  }
}