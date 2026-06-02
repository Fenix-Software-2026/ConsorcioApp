import { Component, OnInit, Injectable, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Usuario } from '../../interfaces/Usuario';
import { UsuarioService } from '../../auth/service/UsuarioService';
import { UnidadService } from '../../auth/service/UnidadService';


@Component({
  selector: 'app-clientes',
  // Sumamos ReactiveFormsModule y FormsModule para el buscador y el modal
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {

  usuarios: Usuario[] = [];        // Lista original del Back
  textoBusqueda: string = '';       // Para capturar lo que se escribe en el input
  usuarioForm!: FormGroup;         // Formulario reactivo obligatorio
  mostrarModal: boolean = false;   // Control de la ventana flotante

  private unidadService = inject(UnidadService);
  listaUnidades: any[] = [];

  constructor(
    private usuarioService: UsuarioService, // Servicio para interactuar con el backend
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarUsuariosDelBackend();
    this.inicializarFormulario();
    this.cargarUnidades();
  }

  cargarUnidades(): void {
    this.unidadService.getUnidades().subscribe({
      next: (data: any) => {
        this.listaUnidades = data;
      },
      error: (err: any) => {
        console.error('Error al traer las unidades:', err);
      }
    });
  }

  // Seteamos el formulario reactivo calzado con los campos de Django
  inicializarFormulario(): void {
    this.usuarioForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['123456', [Validators.required, Validators.minLength(6)]], // Clave genérica por defecto
      piso: ['', [Validators.required, Validators.min(0)]],
      departamento: ['', [Validators.required, Validators.maxLength(5)]]
    });
  }

  cargarUsuariosDelBackend(): void {
    this.usuarioService.getResidentes().subscribe({
      next: (data: any) => {
        this.usuarios = data;
      },
      error: (err: any) => {
        console.error('Error al traer los usuarios:', err);
      }
    });
  }

  guardarNuevoUsuario(): void {
    if (this.usuarioForm.valid) {
      this.usuarioService.crearResidente(this.usuarioForm.value).subscribe({
        next: (usuarioCreado: any) => {          
          this.cargarUsuariosDelBackend(); // Refrescamos la tabla
          this.cerrarModal();
        },
        error: (err: any) => {
          alert('Error al registrar el usuario en la base de datos de Django.');
        }
      });
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }

  // --- BUSCADOR FILTRADO EN TIEMPO REAL ---
  // Esta función filtra la tabla automáticamente a medida que escribís
  get usuariosFiltrados(): Usuario[] {
    if (!this.textoBusqueda.trim()) {
      return this.usuarios;
    }
    return this.usuarios.filter(u => 
      u.username.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      String(u.unidad_detalle.piso).toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );
  }

  // --- CONTROLES DEL MODAL ---
  abrirModal(): void { this.mostrarModal = true; }
  cerrarModal(): void { 
    this.mostrarModal = false; 
    // this.usuarioForm.reset({ rol: 'propietario', residente_actual: true, esta_activo: true, password: '123456' });
  }

  // --- DASHBOARD DINÁMICO ---
  // get totalUsuarios(): number { return this.usuarios.length; }
  // get totalPropietarios(): number { return this.usuarios.filter(u => u.rol?.toLowerCase() === 'propietario').length; }
  // get totalInquilinos(): number { return this.usuarios.filter(u => u.rol?.toLowerCase() === 'inquilino' || u.rol?.toLowerCase() === 'residente').length; }
}