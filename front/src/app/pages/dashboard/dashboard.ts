import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DashboardNavbar } from '../../shared/components/dashboard-navbar/dashboard-navbar';
import { Barralateral } from '../../shared/components/barralateral/barralateral';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    DashboardNavbar,
    Barralateral
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {}