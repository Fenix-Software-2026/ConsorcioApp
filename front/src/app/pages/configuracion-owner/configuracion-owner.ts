import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configuracion-owner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion-owner.html',
  styleUrl: './configuracion-owner.css'
})
export class ConfiguracionOwner {
  usuario = {
    nombre: 'Juan Pérez',
    email: 'juanperez@email.com',
    telefono: '+54 351 123456',
    departamento: 'A-203',
    recibirAvisos: true,
    notifPagos: true,
    fotoUrl: 'https://ui-avatars.com/api/?name=Juan+Perez&size=200'
  };

  seguridad = {
    passActual: '',
    passNueva: ''
  };

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.usuario.fotoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarPerfil() {
    console.log("Datos a enviar al Backend:", { 
      perfil: this.usuario, 
      seguridad: this.seguridad 
    });
    alert('Cambios guardados con éxito');
  }
}