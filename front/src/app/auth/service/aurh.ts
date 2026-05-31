import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core'; // 👈 Sumamos signal y computed
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/login/'; 

  // Al arrancar, intenta leer el token del localStorage y desarmarlo
  // Si hay token, arranca con los datos; si no, arranca en null.
  private currentUserSignal = signal<any>(this.obtenerUsuarioInicial());

  // Exponemos la Signal de forma pública (pero de solo lectura) para los componentes
  public currentUser = this.currentUserSignal.asReadonly();

  //COMPUTED: Crea un booleano reactivo para saber si está autenticado
  public isAuthenticated = computed(() => this.currentUserSignal() !== null);

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      tap(response => {
        if (response.access && response.refresh) {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);

          //  ACTUALIZAMOS LA SIGNAL GLOBAL CON LOS DATOS DEL NUEVO TOKEN
          const datosUser = this.desarmarToken(response.access);
          this.currentUserSignal.set(datosUser);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // VACIAMOS LA SIGNAL GLOBAL
    this.currentUserSignal.set(null);
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  // Función auxiliar privada para que el servicio recuerde al usuario al recargar la página (F5)
  private obtenerUsuarioInicial(): any {
    const token = localStorage.getItem('access_token');
    return token ? this.desarmarToken(token) : null;
  }

  desarmarToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
}