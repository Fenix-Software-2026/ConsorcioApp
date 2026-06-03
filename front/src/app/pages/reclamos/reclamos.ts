import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IReclamos } from '../../interfaces/Reclamos';
import { ReclamoService } from '../../shared/service/ReclamoService';



@Component({
  selector: 'app-reclamos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './reclamos.html',
  styleUrl: './reclamos.css'
})


export class Reclamos implements OnInit {

  private reclamosService = inject(ReclamoService);
  private fb = inject(FormBuilder);

  reclamos = signal<IReclamos[]>([]); // Usamos Signal para que Angular sepa cuándo actualizar la vista
  textoBusqueda = signal<string>('');
  mostrarModal: boolean = false;
  reclamoSeleccionado!: IReclamos;
  estadoForm!: FormGroup;


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
          this.reclamos.set(data);
        },
        error: (err: any) => {
          console.error('Error al traer los reclamos:', err);
        }
      });
    }


  // --- BUSCADOR EN TIEMPO REAL ---
  reclamosFiltrados = computed(() => {
    const texto = this.textoBusqueda().toLowerCase().trim();
    const listaOriginal = this.reclamos();

    if (!texto) return listaOriginal;

    return listaOriginal.filter(r =>
      (r.descripcion || '').toLowerCase().includes(texto) ||
      (r.estado || '') ||
      (r.titulo || '').toLowerCase().includes(texto)
    );
  });

  // --- ELIMINAR RECLAMO DE FORMA VISUAL ---
  eliminarReclamoVisual(numeroReclamo: number): void {
    // Filtramos el arreglo dejando fuera el número que queremos borrar
    this.reclamos.set(this.reclamos().filter(r => r.id !== numeroReclamo)) ;
  }

  // --- ACCIÓN MASIVA: LIMPIAR RESUELTOS ---
  limpiarResueltos(): void {
    // Deja en la lista únicamente los que NO están resueltos
    this.reclamos.set(this.reclamos().filter(r => r.estado !== 'resuelto'));
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
      const index = this.reclamos().findIndex(r => r.titulo === this.reclamoSeleccionado.titulo);
      if (index !== -1) {
        this.reclamos()[index].estado = this.estadoForm.value.nuevoEstado;
      }
      this.reclamosService.editarReclamo(this.reclamoSeleccionado.id!, { estado: this.estadoForm.value.nuevoEstado }).subscribe({
        next: (data: any) => {
          console.log('Reclamo actualizado en el backend:', data);
        },
        error: (err: any) => {
          console.error('Error al actualizar el reclamo en el backend:', err);
        }
      });
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  // --- GETTERS PARA LAS TARJETAS (Se recalculan solas al borrar o cambiar estados) ---
  totalReclamos = computed(() => this.reclamos().length);
  pendientes = computed(() => this.reclamos().filter(r => r.estado === 'pendiente').length);
  enProceso = computed(() => this.reclamos().filter(r => r.estado === 'en_proceso').length);
  resueltos = computed(() => this.reclamos().filter(r => r.estado === 'resuelto').length);
}