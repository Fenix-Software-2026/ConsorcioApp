import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReclamoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/reclamos/'; // Endpoint de tu API en Django


  getReclamos(): Observable< any []> {
    return this.http.get<any []>(this.apiUrl);
  }

  crearReclamo(datosReclamo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, datosReclamo);
  }

  editarReclamo(id: number, datosReclamo: any): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.put<any>(url, datosReclamo);
  }

  eliminarReclamo(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.delete<any>(url);
  }
}
