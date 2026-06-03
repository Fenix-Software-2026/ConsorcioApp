import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/aurh'; // Revisá si quedó así tipeado 'aurh' en tu archivo real

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-navbar.html',
  styleUrls: ['./dashboard-navbar.css']
})
export class DashboardNavbar {
  private authService = inject(AuthService);
  private router = inject(Router);

  // 🔄 Signals locales para la interfaz de la barra
  dropdownOpen = signal<boolean>(false);
  isDark = signal<boolean>(false);

  // 🚀 Conectamos directo con el estado global de autenticación
  loggedUser = computed(() => this.authService.currentUser());

  // 🎨 Computed inteligente para sacar la inicial del rol dinámicamente
  getInicial = computed(() => {
    const usuario = this.loggedUser();
    // Si Django te devuelve 'rol', usás usuario.rol. Si devuelve 'username', usuario.username
    return usuario?.rol ? usuario.rol.charAt(0).toUpperCase() : 'User';
  });

  toggleDropdown(): void {
    this.dropdownOpen.update(value => !value);
  }

  toggleDarkMode(): void {
    this.isDark.update(value => !value);
    // Opcional: Podés meter la lógica para clavarle la clase al body
    document.body.classList.toggle('dark-mode', this.isDark());
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}