import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ==========================================
// 1. INTERFAZ (Modelos basados en Django)
// ==========================================
export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  password?: string;
  rol: string; // 'propietario' o 'inquilino'
  residente_actual: boolean;
  esta_activo: boolean;
  unidad: number | string; // ID o código de la unidad
}

// ==========================================
// 2. SERVICIO DE CONEXIÓN API
// ==========================================
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  // Acordate que en tu router de Django está en singular: 'usuario'
  private apiUrl = 'http://localhost:8000/api/usuario/';

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }
}

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================
@Component({
  selector: 'app-clientes',
  standalone: true,
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

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarUsuariosDelBackend();
    this.inicializarFormulario();
  }

  // Seteamos el formulario reactivo calzado con los campos de Django
  inicializarFormulario(): void {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]], // Password base para la facultad
      rol: ['propietario', Validators.required],
      residente_actual: [true],
      esta_activo: [true],
      unidad: ['', Validators.required]
    });
  }

  cargarUsuariosDelBackend(): void {
    this.clientService.getUsuarios().subscribe({
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
      this.clientService.crearUsuario(this.usuarioForm.value).subscribe({
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
      u.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      u.apellido.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      String(u.unidad).toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );
  }

  // --- CONTROLES DEL MODAL ---
  abrirModal(): void { this.mostrarModal = true; }
  cerrarModal(): void { 
    this.mostrarModal = false; 
    this.usuarioForm.reset({ rol: 'propietario', residente_actual: true, esta_activo: true, password: '123456' });
  }

  // --- DASHBOARD DINÁMICO ---
  get totalUsuarios(): number { return this.usuarios.length; }
  get totalPropietarios(): number { return this.usuarios.filter(u => u.rol?.toLowerCase() === 'propietario').length; }
  get totalInquilinos(): number { return this.usuarios.filter(u => u.rol?.toLowerCase() === 'inquilino' || u.rol?.toLowerCase() === 'residente').length; }
}