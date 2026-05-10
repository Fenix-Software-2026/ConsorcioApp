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
      rol: 'Scrum Master | Front-end Developer',
      bio: 'Desarrollador front-end y Scrum Master del proyecto',
      foto: '/profile-silhouette.png' 
    },
    {
      nombre: 'Ivan Ignacio Moreno Rivero', 
      rol: 'Full-Stack Developer',
      bio: 'Desarrollador Full-Stack del proyecto',
      foto: '/profile-silhouette.png'
    },
    {
      nombre: 'Luis Gastón Alonso',
      rol: 'Back-end developer | Database Administrator',
      bio: 'Desarrollador back-end y administrador de base de datos del proyecto',
      foto: '/profile-silhouette.png' 
    },
       {
      nombre: 'Luis Gerardo Catalas',
      rol: 'Back-end developer | Configuration Manager',
      bio: 'Desarrollador back-end y gestión de las versiones del código',
      foto: '/profile-silhouette.png' 
    },
          {
      nombre: 'Veronica Cecilia Vargas',
      rol: 'Technical Writer | Product Owner',
      bio: 'Redactora técnica de documentación y responsable de maximizar el valor del producto',
      foto: '/profile-silhouette.png' 
    },


    
  ];

  ngOnInit() {
    AOS.init({
      duration: 1000, 
      once: true,    
      mirror: false   
    });
  }
}