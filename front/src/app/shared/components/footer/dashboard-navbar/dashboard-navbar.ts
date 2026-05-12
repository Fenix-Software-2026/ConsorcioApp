import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-navbar.html',
  styleUrls: ['./dashboard-navbar.css']
})
export class DashboardNavbar {

  // titulo del panel (admin / owner / etc)
  @Input() panelTitle: string = 'Administrador';

  // email del usuario logueado (luego vendra de auth real)
  @Input() userEmail: string = 'usuario@gmail.com';

  // estado visual del modo oscuro (solo frontend por ahora)
  isDark: boolean = false;

  // controla si el dropdown del usuario esta abierto
  dropdownOpen = false;

  toggleDarkMode() {
    // cambia entre modo oscuro y claro
    this.isDark = !this.isDark;
  }

  toggleDropdown() {
    // abre o cierra el menu del usuario
    this.dropdownOpen = !this.dropdownOpen;
  }

}