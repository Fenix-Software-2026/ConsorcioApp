import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../interfaces/Usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8000/api/usuario/'; // Endpoint de tu API en Django

  constructor(private http: HttpClient) { }

    // 1. Traer todos los usuarios (Para la grilla/tabla)
  getResidentes(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // 2. Guardar el nuevo usuario del formulario
  crearResidente(datosUsuario: Usuario): Observable<any> {
    return this.http.post<any>(this.apiUrl, datosUsuario);
  }

  editarResidente(id: number, datosUsuario: Usuario): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.put<any>(url, datosUsuario);
  }

  eliminarResidente(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.delete<any>(url);
  }
}