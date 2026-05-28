import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

export interface ReclamoAdmin {
  numero: string;
  descripcion: string;
  estado: string; // 'Pendiente', 'En proceso', 'Resuelto'
  fecha: string;
  usuario_nombre: string;
}

@Component({
  selector: 'app-reclamos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './reclamos.html',
  styleUrl: './reclamos.css'
})
export class Reclamos implements OnInit {

  // Tu lista base de control local
  reclamos: ReclamoAdmin[] = [
    { numero: '001', descripcion: 'Ascensor fuera de servicio', estado: 'Pendiente', fecha: '22/05/2026', usuario_nombre: 'Juan Pérez (A-203)' },
    { numero: '002', descripcion: 'Fuga de agua en pasillo', estado: 'En proceso', fecha: '21/05/2026', usuario_nombre: 'Gisela DAndrea (B-104)' },
    { numero: '003', descripcion: 'Luz quemada en cochera', estado: 'Resuelto', fecha: '20/05/2026', usuario_nombre: 'Nahuel Cufré (C-302)' }
  ];

  textoBusqueda: string = '';
  mostrarModal: boolean = false;
  reclamoSeleccionado!: ReclamoAdmin;
  estadoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.estadoForm = this.fb.group({
      nuevoEstado: ['Pendiente', Validators.required]
    });
  }

  // --- BUSCADOR EN TIEMPO REAL ---
  get reclamosFiltrados(): ReclamoAdmin[] {
    if (!this.textoBusqueda.trim()) {
      return this.reclamos;
    }
    return this.reclamos.filter(r => 
      r.descripcion.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      r.estado.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      r.usuario_nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );
  }

  // --- ELIMINAR RECLAMO DE FORMA VISUAL ---
  eliminarReclamoVisual(numeroReclamo: string): void {
    // Filtramos el arreglo dejando fuera el número que queremos borrar
    this.reclamos = this.reclamos.filter(r => r.numero !== numeroReclamo);
  }

  // --- ACCIÓN MASIVA: LIMPIAR RESUELTOS ---
  limpiarResueltos(): void {
    // Deja en la lista únicamente los que NO están resueltos
    this.reclamos = this.reclamos.filter(r => r.estado !== 'Resuelto');
  }

  // --- MODAL PARA CAMBIAR ESTADOS ---
  abrirGestion(reclamo: ReclamoAdmin): void {
    this.reclamoSeleccionado = reclamo;
    this.estadoForm.setValue({ nuevoEstado: reclamo.estado });
    this.mostrarModal = true;
  }

  actualizarEstadoLocal(): void {
    if (this.estadoForm.valid) {
      // Buscamos el reclamo en nuestra lista y mutamos su estado directamente
      const index = this.reclamos.findIndex(r => r.numero === this.reclamoSeleccionado.numero);
      if (index !== -1) {
        this.reclamos[index].estado = this.estadoForm.value.nuevoEstado;
      }
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  // --- GETTERS PARA LAS TARJETAS (Se recalculan solas al borrar o cambiar estados) ---
  get totalReclamos(): number { return this.reclamos.length; }
  get pendientes(): number { return this.reclamos.filter(r => r.estado === 'Pendiente').length; }
  get enProceso(): number { return this.reclamos.filter(r => r.estado === 'En proceso').length; }
  get resueltos(): number { return this.reclamos.filter(r => r.estado === 'Resuelto').length; }
}