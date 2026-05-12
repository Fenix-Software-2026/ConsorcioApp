import { Component } from '@angular/core';
import { Barralateral } from '../barralateral/barralateral';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-layout-barra',
  standalone: true,
  imports: [Barralateral, RouterOutlet],
  templateUrl: './layout-barra.html',
  styleUrl: './layout-barra.css',
})
export class LayoutBarra {}