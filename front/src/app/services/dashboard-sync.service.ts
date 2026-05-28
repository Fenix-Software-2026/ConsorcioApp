import { Injectable } from '@angular/core';
import { ReclamoService } from './reclamo.service'; 
// Asume que aquí importarás tus otros servicios:
// import { ExpensasService } from './expensas.service';
// import { EmpleadoService } from './empleado.service';

@Injectable({ providedIn: 'root' })
export class DashboardSyncService {
  constructor(private reclamoService: ReclamoService) {}

  // Este método devuelve un objeto con los datos de todos los módulos
  getResumenGeneral() {
    return {
      // Ejemplo: Llamada real a tu servicio de reclamos
      reclamos: this.reclamoService.getReclamos(), 
      // Aquí agregarías: expensas: this.expensasService.getAll(),
      // Aqui agregarías: empleados: this.empleadoService.getAll()
    };
  }
}