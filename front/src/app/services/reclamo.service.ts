import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definimos el molde del Reclamo según el serializer de Django
export interface Reclamo {
  id?: number; // El ID lo da Django automáticamente
  titulo: string;
  descripcion: string;
  estado: string; // 'Pendiente', 'En proceso', 'Resuelto'
  // Puedes agregar fecha o usuario si tu backend los requiere
}

@Injectable({
  providedIn: 'root'
})
export class ReclamoService {
  // La URL base que descubrimos en el router de Django
  private apiUrl = 'http://localhost:8000/api/reclamos/';

  // Inyectamos HttpClient para poder usar GET, POST, PUT, DELETE
  constructor(private http: HttpClient) { }

  // GET: Trae todos los reclamos desde la base de datos de Django
  getReclamos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // POST: Guarda un nuevo reclamo creado por el propietario
  crearReclamo(reclamo: Reclamo): Observable<Reclamo> {
    return this.http.post<Reclamo>(this.apiUrl, reclamo);
  }
}