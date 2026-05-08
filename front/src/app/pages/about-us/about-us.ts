import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos'; // Nota para Iván: Instalé esta libreria para la animación al hacer scroll, NO es nativa de TypeScript, es de JavaScript. Mientras sigamos con el front testeemos que tal va.

@Component({
  selector: 'app-about-us',
  standalone: true, 
  imports: [], 
  templateUrl: './about-us.html',
  styleUrls: ['./about-us.css']
})
export class AboutUs implements OnInit {
  
  equipo = [
    {
      nombre: 'Nahuel Santiago Cufre',
      rol: 'Front-end Developer',
      bio: 'Estudiante de desarrollo web del Instituto Superior Politécnico de Córdoba.',
      foto: 'assets/img/nahuel.jpg' 
    },
    {
      nombre: 'dev2', 
      rol: 'rol de el otro desarrollador',
      bio: 'bio de el otro desarrollador',
      foto: 'assets/img/dev2.jpg'
    }
  ];

  ngOnInit() {
    AOS.init({
      duration: 1000, 
      once: true,    
      mirror: false   
    });
  }
}