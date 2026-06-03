import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ConfiguracionConsorcio {
  nombreConsorcio: string;
  direccion: string;
  email: string;
  telefono: string;
  interesMora: number;
  diaVencimiento: number;
}

export interface Colaborador {
  username: string;
  nombre: string;
  rol: 'Co-Administrador' | 'Asistente / Secretario';
  estado: 'Activo' | 'Suspendido';
  passwordProvisorio?: string; // Innovación: Credencial inicial
}

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css'
})
export class Configuracion {

  configuracion: ConfiguracionConsorcio = {
    nombreConsorcio: 'Edificio Central',
    direccion: 'Av. Principal 123',
    email: 'administracion@consorcio.com',
    telefono: '+54 351 1234567',
    interesMora: 4.5,
    diaVencimiento: 10
  };

  colaboradores: Colaborador[] = [
    { username: 'marian_admin', nombre: 'Mariana Gómez', rol: 'Co-Administrador', estado: 'Activo' },
    { username: 'jorge_asist', nombre: 'Jorge Peralta', rol: 'Asistente / Secretario', estado: 'Activo' }
  ];

  nuevoColaborador: Colaborador = {
    username: '',
    nombre: '',
    rol: 'Asistente / Secretario',
    estado: 'Activo',
    passwordProvisorio: ''
  };

  // Estados UI
  guardandoConfig: boolean = false;
  mostrarToast: boolean = false;
  mostrarModalColaborador: boolean = false;
  verPasswordForm: boolean = false; // Control de visibilidad del password (ojo)

  guardarConfiguracionLocal(): void {
    if (!this.configuracion.nombreConsorcio || !this.configuracion.direccion) return;
    this.guardandoConfig = true;

    setTimeout(() => {
      this.guardandoConfig = false;
      this.mostrarToast = true;
      setTimeout(() => this.mostrarToast = false, 3000);
    }, 1200);
  }

  // --- CONTROL DE ACCESOS Y CREDENCIALES ---
  abrirModalColaborador(): void {
    this.mostrarModalColaborador = true;
    this.verPasswordForm = false;
  }

  cerrarModalColaborador(): void {
    this.mostrarModalColaborador = false;
    this.nuevoColaborador = { username: '', nombre: '', rol: 'Asistente / Secretario', estado: 'Activo', passwordProvisorio: '' };
  }

  // Innovación: Genera una clave segura temporal a partir del nombre de usuario elegido
  sugerirContrasena(): void {
    if (this.nuevoColaborador.username.trim()) {
      const userLimpio = this.nuevoColaborador.username.toLowerCase().replace(/\s+/g, '');
      this.nuevoColaborador.passwordProvisorio = `${userLimpio}.2026`;
    }
  }

  toggleVisibilidadPassword(): void {
    this.verPasswordForm = !this.verPasswordForm;
  }

  agregarColaborador(): void {
    if (!this.nuevoColaborador.username || !this.nuevoColaborador.nombre || !this.nuevoColaborador.passwordProvisorio) {
      alert('Por favor, rellene todos los campos, incluyendo la clave provisoria.');
      return;
    }
    
    this.colaboradores.push({ ...this.nuevoColaborador });
    console.log('Credenciales listas para persistir en Base de Datos:', {
      usuario: this.nuevoColaborador.username,
      claveHasheable: this.nuevoColaborador.passwordProvisorio,
      rol: this.nuevoColaborador.rol
    });
    
    this.cerrarModalColaborador();
  }

  blanquearClave(colab: Colaborador): void {
    const nuevaClave = `${colab.username}.reset26`;
    colab.passwordProvisorio = nuevaClave;
    alert(`Se ha reestablecido la contraseña de @${colab.username}.\nClave provisoria nueva: ${nuevaClave}`);
  }

  alternarEstadoColaborador(colab: Colaborador): void {
    colab.estado = colab.estado === 'Activo' ? 'Suspendido' : 'Activo';
  }

  eliminarColaborador(username: string): void {
    this.colaboradores = this.colaboradores.filter(c => c.username !== username);
  }
}