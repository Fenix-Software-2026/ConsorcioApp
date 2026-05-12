import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DashboardNavbar } from '../../shared/components/footer/dashboard-navbar/dashboard-navbar';
import { BarralateralOwner } from '../../shared/components/footer/barralateral-owner/barralateral-owner';

@Component({
  selector: 'app-dashboard-owner',
  standalone: true,
  imports: [
    RouterOutlet,
    DashboardNavbar,
    BarralateralOwner
  ],
  templateUrl: './dashboard-owner.html',
  styleUrl: './dashboard-owner.css',
})
export class DashboardOwner {}