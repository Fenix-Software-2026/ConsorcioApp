import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // IMPORTANTE: Agregamos esto
import { DashboardSyncService } from '../../services/dashboard-sync.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterModule], // IMPORTANTE: Agregamos RouterModule aquí
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css',
})
export class AdminHome implements OnInit {
  
  resumen = {
    reclamosPendientes: 0,
    expensasMora: 8,
    empleadosActivos: 3,
    serviciosCriticos: 2
  };

  constructor(private sync: DashboardSyncService) {}

  ngOnInit() {
    this.sync.getResumenGeneral().reclamos.subscribe(data => {
      this.resumen.reclamosPendientes = data.filter((r: any) => r.estado !== 'Resuelto').length;
    });
  }
}