import { Component, inject, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/service/aurh';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl:'./dashboard-navbar.html',
  styleUrls: ['./dashboard-navbar.css']
})
export class DashboardNavbar {

  // titulo del panel (admin / owner / etc)
  @Input() usuarioName: string = '';

  // email del usuario logueado (luego vendra de auth real)
  @Input() usuarioRol: string = '';

  // controla si el dropdown del usuario esta abierto
  dropdownOpen = false;

  private authService = inject(AuthService);
  private routes = inject(Router);

  // Utilizamos el signal del authService para que se actualice dinamicamente
  loggedUser = computed(() => this.authService.currentUser());

  constructor() {}

  toggleDropdown() {
    // abre o cierra el menu del usuario
    this.dropdownOpen = !this.dropdownOpen;
  }

  onLogout() {
    // llama al servicio de auth para cerrar sesion
    this.authService.logout();
    // redirige al login
    this.routes.navigate(['/login']);
  }

}