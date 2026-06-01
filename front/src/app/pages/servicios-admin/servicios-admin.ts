import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

// ==========================================
// 1. INTERFAZ DEL MODELO DE SERVICIOS
// ==========================================
export interface ServicioConsorcio {
  id?: number;
  nombre: string;     // Tipo/Nombre del servicio
  proveedor: string;  // Empresa proveedora
  frecuencia: string; // Diaria, Semanal, Mensual, Bimestral, etc.
  estado: string;     // 'Activo' o 'Pendiente'
}

@Component({
  selector: 'app-servicios-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './servicios-admin.html',
  styleUrl: './servicios-admin.css'
})
export class ServiciosAdmin implements OnInit {

  // Listado local estático con tus datos base y los nuevos tipos sugeridos
  servicios: ServicioConsorcio[] = [
    { nombre: 'Limpieza', proveedor: 'Limpieza Integral SRL', frecuencia: 'Diaria', estado: 'Activo' },
    { nombre: 'Mantenimiento Ascensores', proveedor: 'Ascensores Córdoba', frecuencia: 'Mensual', estado: 'Activo' },
    { nombre: 'Seguridad', proveedor: 'Green Service', frecuencia: 'Mensual', estado: 'Pendiente' },
    { nombre: 'Fumigación', proveedor: 'Plagas Zero', frecuencia: 'Bimestral', estado: 'Activo' }
  ];

  textoBusqueda: string = '';
  mostrarModalAlta: boolean = false;
  mostrarModalGestion: boolean = false;

  servicioForm!: FormGroup;
  gestionForm!: FormGroup;
  servicioSeleccionado!: ServicioConsorcio;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inicializarFormularios();
  }

  inicializarFormularios(): void {
    // Formulario Reactivo para la creación de nuevos servicios contratados
    this.servicioForm = this.fb.group({
      nombre: ['', Validators.required],
      proveedor: ['', Validators.required],
      frecuencia: ['Mensual', Validators.required],
      estado: ['Activo', Validators.required]
    });

    // Formulario Reactivo para alternar estados operacionales rápidamente
    this.gestionForm = this.fb.group({
      nuevoEstado: ['Activo', Validators.required]
    });
  }

  // --- FILTRADO EN TIEMPO REAL ---
  get serviciosFiltrados(): ServicioConsorcio[] {
    if (!this.textoBusqueda.trim()) {
      return this.servicios;
    }
    return this.servicios.filter(s => 
      s.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      s.proveedor.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      s.estado.toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );
  }

  // --- CONTROL DE ACCIONES LOCALES ---
  guardarNuevoServicio(): void {
    if (this.servicioForm.valid) {
      // Inserción directa en el arreglo de memoria
      this.servicios.push(this.servicioForm.value);
      this.cerrarModales();
    } else {
      this.servicioForm.markAllAsTouched();
    }
  }

  actualizarEstadoLocal(): void {
    if (this.gestionForm.valid) {
      const index = this.servicios.findIndex(s => s.proveedor === this.servicioSeleccionado.proveedor && s.nombre === this.servicioSeleccionado.nombre);
      if (index !== -1) {
        this.servicios[index].estado = this.gestionForm.value.nuevoEstado;
      }
      this.cerrarModales();
    }
  }

  eliminarServicioVisual(nombreServicio: string, proveedorServicio: string): void {
    this.servicios = this.servicios.filter(s => !(s.nombre === nombreServicio && s.proveedor === proveedorServicio));
  }

  // --- APERTURA Y CIERRE DE MODALES ---
  abrirAlta(): void {
    this.mostrarModalAlta = true;
  }

  abrirGestion(servicio: ServicioConsorcio): void {
    this.servicioSeleccionado = servicio;
    this.gestionForm.setValue({ nuevoEstado: servicio.estado });
    this.mostrarModalGestion = true;
  }

  cerrarModales(): void {
    this.mostrarModalAlta = false;
    this.mostrarModalGestion = false;
    this.servicioForm.reset({ frecuencia: 'Mensual', estado: 'Activo' });
  }

  // --- GETTERS COMPLEMENTARIOS PARA LAS CARDS ---
  get totalServicios(): number { return this.servicios.length; }
  get activos(): number { return this.servicios.filter(s => s.estado === 'Activo').length; }
  get pendientes(): number { return this.servicios.filter(s => s.estado === 'Pendiente').length; }
}