import { Component, OnInit, Injectable, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Usuario } from '../../interfaces/Usuario';
import { UsuarioService } from '../../shared/service/UsuarioService';
import { UnidadService } from '../../shared/service/UnidadService';
import { UsuarioModal } from "./components/usuario-modal/usuario-modal";
import { UsuarioTabla } from "./components/usuario-tabla/usuario-tabla";


@Component({
  selector: 'app-clientes',
  // Sumamos ReactiveFormsModule y FormsModule para el buscador y el modal
  imports: [CommonModule, ReactiveFormsModule, FormsModule, UsuarioModal, UsuarioTabla],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {
  
  private usuarioService = inject(UsuarioService);
  private unidadService = inject(UnidadService); // 👈 Reinyectamos el servicio

  // Signals de Estado
  usuarios = signal<Usuario[]>([]);
  textoBusqueda = signal<string>('');
  mostrarModal: boolean = false;

  // Variables de datos (Podés dejarla como array común o hacerla Signal, como gustes)
  listaUnidades: any[] = [];

  ngOnInit(): void {
    this.cargarUsuariosDelBackend();
    this.cargarUnidadesDelBackend(); // 👈 La disparamos al arrancar
  }

  cargarUsuariosDelBackend(): void {
    this.usuarioService.getResidentes().subscribe({
      next: (data: Usuario[]) => {
        console.log('Usuarios traídos del backend:', data);
        this.usuarios.set(data);
      },
      error: (err) => console.error('Error al traer los usuarios:', err)
    });
  }

  // 👈 Devolvemos la función que le pega a Django para traer los deptos
  cargarUnidadesDelBackend(): void {
    this.unidadService.getUnidades().subscribe({
      next: (data: any[]) => {
        console.log(data)
        this.listaUnidades = data;
      },
      error: (err) => console.error('Error al traer las unidades:', err)
    });
  }

  // Computed para el buscador en tiempo real
  usuariosFiltrados = computed(() => {
    const texto = this.textoBusqueda().toLowerCase().trim();
    const listaOriginal = this.usuarios();

    if (!texto) return listaOriginal;

    return listaOriginal.filter(u =>
      u.username.toLowerCase().includes(texto) ||
      u.email.toLowerCase().includes(texto) ||
      String(u.unidad_detalle?.piso || '').toLowerCase().includes(texto)
    );
  });

  // Controles del modal
  abrirModal(): void { this.mostrarModal = true; }
  cerrarModal(): void { this.mostrarModal = false; }
}