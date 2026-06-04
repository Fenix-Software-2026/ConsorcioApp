
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comunicado } from '../../interfaces/comunicado-interface'; 

@Injectable({
  providedIn: 'root',
})
export class ComunicadoService {
  private apiUrl = 'http://localhost:8000/api/comunicados/';

  constructor(private http: HttpClient) {}

  
  getComunicados(): Observable<Comunicado[]> {
    return this.http.get<Comunicado[]>(this.apiUrl);
  }

 
  createComunicado(comunicado: Comunicado): Observable<Comunicado> {
    return this.http.post<Comunicado>(this.apiUrl, comunicado);
  }

  // deleteComunicado() ---- me faltaria el delete, no fusionen ramas todavia xfa :(
}