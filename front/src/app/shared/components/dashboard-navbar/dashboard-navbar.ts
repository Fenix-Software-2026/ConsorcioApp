import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/service/aurh';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-navbar.html',
  styleUrls: ['./dashboard-navbar.css']
})
export class DashboardNavbar {

  // titulo del panel (admin / owner / etc)
  @Input() usuarioName: string = '';

  // email del usuario logueado (luego vendra de auth real)
  @Input() usuarioRol: string = '';

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

  private authService = inject(AuthService);
  private router = inject(Router);

  onLogout() {
    // llama al servicio de auth para cerrar sesion
    this.authService.logout();
    // redirige al login
    this.router.navigate(['/login']);
  }


}