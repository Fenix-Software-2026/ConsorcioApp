import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnidadService {
  private apiUrl = 'http://localhost:8000/api/unidad/';

  constructor(private http: HttpClient) {}
  
  getUnidades():Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  
}
