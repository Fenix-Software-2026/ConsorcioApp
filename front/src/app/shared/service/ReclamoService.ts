import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { IReclamos } from '../../interfaces/Reclamos';

@Injectable({
  providedIn: 'root',
})
export class ReclamoService {
   #http = inject(HttpClient);
  #apiUrl = 'http://localhost:8000/api/reclamos/';

  #reclamos = signal<IReclamos[]>([]);
  public reclamos = this.#reclamos.asReadonly();



  public cargarReclamos(): void {
    this.#http.get<IReclamos[]>(this.#apiUrl).subscribe({
      next: (data) => this.#reclamos.set(data),
      error: (err) => console.error('Error al cargar reclamos:', err)
    });
  }

  public crearReclamo(nuevoReclamo: Omit<IReclamos, 'id' | 'fecha_creacion'>): void {
    this.#http.post<IReclamos>(this.#apiUrl, nuevoReclamo).subscribe({
      next: (reclamoCreado) => {
        this.#reclamos.update(lista => [...lista, reclamoCreado]);
      },
      error: (err) => console.error('Error al crear reclamo:', err)
    });
  }
  

  public actualizarEstadoReclamo(id: number, nuevoEstado: string): void {
    const urlId = `${this.#apiUrl}${id}/`;

    // Mandamos solo el campo que cambia a Django
    this.#http.patch<IReclamos>(urlId, { estado: nuevoEstado }).subscribe({
      next: (reclamoModificado) => {
        // 🔄 Mapeamos el array: reemplazamos el viejo por el que modificó Django
        this.#reclamos.update(lista =>
          lista.map(r => r.id === id ? reclamoModificado : r)
        );
        console.log(`Reclamo N° ${id} actualizado a: ${nuevoEstado}`);
      },
      error: (err) => console.error('Error al actualizar estado:', err)
    });
  }

  public eliminarReclamo(id: number): void {
    const urlId = `${this.#apiUrl}${id}/`;

    this.#http.delete(urlId).subscribe({
      next: () => {
        // 🧹 Filtramos el array de la Signal para sacar el ID que eliminó Django
        this.#reclamos.update(lista => lista.filter(r => r.id !== id));
      },
      error: (err) => console.error('Error al eliminar reclamo:', err)
    });
  }
}
