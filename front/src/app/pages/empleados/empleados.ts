import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

// ==========================================
// INTERFAZ DEL MODELO DE EMPLEADOS
// ==========================================
export interface EmpleadoConsorcio {
  nombre: string;
  cargo: string;     // 'Limpieza', 'Seguridad', 'Intendencia / Portería'
  turno: string;     // 'Mañana', 'Tarde', 'Noche'
  estado: string;    // 'Activo' o 'Licencia'
  telefono: string;  // Contacto directo
  fechaIngreso: string;
}

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './empleados.html',
  styleUrl: './empleados.css'
})
export class Empleados implements OnInit {

  // Arreglo de datos enriquecido con la información operativa propuesta
  empleados: EmpleadoConsorcio[] = [
    { nombre: 'Carlos Gómez', cargo: 'Limpieza', turno: 'Mañana', estado: 'Activo', telefono: '3516112233', fechaIngreso: '2024-03-15' },
    { nombre: 'Javier Rodríguez', cargo: 'Seguridad', turno: 'Noche', estado: 'Activo', telefono: '3516445566', fechaIngreso: '2023-11-01' },
    { nombre: 'María López', cargo: 'Limpieza', turno: 'Tarde', estado: 'Licencia', telefono: '3516778899', fechaIngreso: '2025-01-10' }
  ];

  textoBusqueda: string = '';
  mostrarModalAlta: boolean = false;
  mostrarModalGestion: boolean = false;

  empleadoForm!: FormGroup;
  gestionForm!: FormGroup;
  empleadoSeleccionado!: EmpleadoConsorcio;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inicializarFormularios();
  }

  inicializarFormularios(): void {
    // Formulario Reactivo para dar de alta nuevo personal de trabajo
    this.empleadoForm = this.fb.group({
      nombre: ['', Validators.required],
      cargo: ['Limpieza', Validators.required],
      turno: ['Mañana', Validators.required],
      estado: ['Activo', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      fechaIngreso: ['2026-05-27', Validators.required]
    });

    // Formulario Reactivo para modificar estados laborales
    this.gestionForm = this.fb.group({
      nuevoEstado: ['Activo', Validators.required]
    });
  }

  // --- FILTRADO DE EMPLEADOS EN TIEMPO REAL ---
  get empleadosFiltrados(): EmpleadoConsorcio[] {
    if (!this.textoBusqueda.trim()) {
      return this.empleados;
    }
    return this.empleados.filter(e => 
      e.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      e.cargo.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      e.estado.toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );
  }

  // --- MÉTODOS DE ACCIÓN LOCAL EN MEMORIA ---
  guardarNuevoEmpleado(): void {
    if (this.empleadoForm.valid) {
      this.empleados.push(this.empleadoForm.value);
      this.cerrarModales();
    } else {
      this.empleadoForm.markAllAsTouched();
    }
  }

  actualizarEstadoLocal(): void {
    if (this.gestionForm.valid) {
      const index = this.empleados.findIndex(e => e.nombre === this.empleadoSeleccionado.nombre);
      if (index !== -1) {
        this.empleados[index].estado = this.gestionForm.value.nuevoEstado;
      }
      this.cerrarModales();
    }
  }

  eliminarEmpleadoVisual(nombre: string): void {
    this.empleados = this.empleados.filter(e => e.nombre !== nombre);
  }

  // --- MANEJO DE VENTANAS FLOTANTES ---
  abrirAlta(): void {
    this.mostrarModalAlta = true;
  }

  abrirGestion(empleado: EmpleadoConsorcio): void {
    this.empleadoSeleccionado = empleado;
    this.gestionForm.setValue({ nuevoEstado: empleado.estado });
    this.mostrarModalGestion = true;
  }

  cerrarModales(): void {
    this.mostrarModalAlta = false;
    this.mostrarModalGestion = false;
    this.empleadoForm.reset({ cargo: 'Limpieza', turno: 'Mañana', estado: 'Activo', fechaIngreso: '2026-05-27' });
  }

  // --- COUNTERS AUTO-CALCULADOS PARA LAS CARDS ---
  get totalEmpleados(): number { return this.empleados.length; }
  get activos(): number { return this.empleados.filter(e => e.estado === 'Activo').length; }
  get enLicencia(): number { return this.empleados.filter(e => e.estado === 'Licencia').length; }
}