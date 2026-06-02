import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IReclamos } from '../../interfaces/Reclamos';
import { ReclamoService } from '../../auth/service/ReclamoService';



@Component({
  selector: 'app-reclamos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './reclamos.html',
  styleUrl: './reclamos.css'
})


export class Reclamos implements OnInit {

  private reclamosService = inject(ReclamoService);
  reclamos: IReclamos[] = [];

  textoBusqueda: string = '';
  mostrarModal: boolean = false;
  reclamoSeleccionado!: IReclamos;
  estadoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cargarReclamosDelBackend();
    this.estadoForm = this.fb.group({
      nuevoEstado: ['Pendiente', Validators.required]
    });
  }


    cargarReclamosDelBackend(): void {
      this.reclamosService.getReclamos().subscribe({
        next: (data: any) => {
         console.log(data)
          this.reclamos = data;
        },
        error: (err: any) => {
          console.error('Error al traer los reclamos:', err);
        }
      });
    }


  // --- BUSCADOR EN TIEMPO REAL ---
  get reclamosFiltrados(): IReclamos[] {
    if (!this.textoBusqueda.trim()) {
      return this.reclamos;
    }
    return this.reclamos.filter(r => 
      r.descripcion.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      // r.estado.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      r.titulo.toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );
  }

  // --- ELIMINAR RECLAMO DE FORMA VISUAL ---
  eliminarReclamoVisual(numeroReclamo: string): void {
    // Filtramos el arreglo dejando fuera el número que queremos borrar
    this.reclamos = this.reclamos.filter(r => r.titulo !== numeroReclamo);
  }

  // --- ACCIÓN MASIVA: LIMPIAR RESUELTOS ---
  limpiarResueltos(): void {
    // Deja en la lista únicamente los que NO están resueltos
    this.reclamos = this.reclamos.filter(r => r.titulo !== 'Resuelto');
  }

  // --- MODAL PARA CAMBIAR ESTADOS ---
  abrirGestion(reclamo: IReclamos): void {
    this.reclamoSeleccionado = reclamo;
    this.estadoForm.setValue({ nuevoEstado: reclamo.titulo }); // Pre-carga el estado actual en el select
    this.mostrarModal = true;
  }

  actualizarEstadoLocal(): void {
    if (this.estadoForm.valid) {
      // Buscamos el reclamo en nuestra lista y mutamos su estado directamente
      const index = this.reclamos.findIndex(r => r.titulo === this.reclamoSeleccionado.titulo);
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