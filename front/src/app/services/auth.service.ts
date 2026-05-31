import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Inicializamos con un null para detectar cuando no hay sesión
  private usuarioSource = new BehaviorSubject<any>(null);
  usuario$ = this.usuarioSource.asObservable();

  constructor() {
    // Al iniciar, verificamos si ya había alguien logueado
    const data = localStorage.getItem('usuario');
    if (data) {
      this.usuarioSource.next(JSON.parse(data));
    }
  }

  // MÉTODO PARA EL LOGIN
  iniciarSesion(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSource.next(usuario); // Notifica a todos al instante
  }
}