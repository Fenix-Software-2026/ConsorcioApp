import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-navbar.html',
  styleUrls: ['./dashboard-navbar.css']
})
export class DashboardNavbar {

  // antes esto venia por @Input()
  // ahora obtengo los datos directamente desde localStorage
  // para mostrar quien inicio sesion realmente
  usuario: any = {};

  // estado visual del modo oscuro (solo frontend por ahora)
  isDark: boolean = false;

  // controla si el dropdown del usuario esta abierto
  dropdownOpen = false;

  constructor(private router: Router) {

    // busco si existe informacion del usuario guardada
    // localStorage devuelve texto, por eso luego uso JSON.parse()

    const datosUsuario = localStorage.getItem('usuario');

    // verifico que existan datos antes de convertirlos
    // evita errores si alguien entra sin logearse

    if (datosUsuario) {

      this.usuario = JSON.parse(datosUsuario);

    }

  }

  // devuelve la inicial para mostrar dentro del circulo
  // ejemplo:
  // Administrador → A
  // Propietario / Inquilino → P

  getInicial(): string {

    return this.usuario?.rol
      ? this.usuario.rol.charAt(0)
      : 'U';
      // U = usuario por defecto si no encuentra datos
  }

  toggleDarkMode() {
    // cambia entre modo oscuro y claro
    this.isDark = !this.isDark;
  }

  toggleDropdown() {
    // abre o cierra el menu del usuario
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {

    // elimino informacion del usuario guardada
    // simula cerrar sesion hasta tener auth real

    localStorage.removeItem('usuario');

    // redirijo nuevamente al login

    this.router.navigate(['/login']);

  }

  // devuelve la ruta correcta segun el rol del usuario
// administrador -> dashboard/configuracion
// propietario -> owner/configuracion

getConfiguracionRuta(): string {

  return this.usuario?.rol === 'Administrador'
    ? '/dashboard/configuracion'
    : '/owner/configuracion';

}

}