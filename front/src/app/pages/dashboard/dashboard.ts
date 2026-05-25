import { RouterOutlet } from '@angular/router';

import { DashboardNavbar } from '../../shared/components/dashboard-navbar/dashboard-navbar';
import { Barralateral } from '../../shared/components/barralateral/barralateral';
import { Component, computed } from '@angular/core';
import { AuthService } from '../../auth/service/aurh';

@Component({
   selector: 'app-dashboard',
   imports: [
    RouterOutlet,
    DashboardNavbar,
    Barralateral
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard  {
  
  //  Escuchan reactivamente al servicio
  usuarioName = computed(() => {
    const user = this.authService.currentUser();
    return user ? (user.username) : 'Residente';
  });

  usuarioRol = computed(() => {
    const user = this.authService.currentUser();
    return user? user.rol : 'Propietario';
  });

  // Solo inyectamos el servicio en el constructor, no hace falta ngOnInit
  constructor(private authService: AuthService) {}
}