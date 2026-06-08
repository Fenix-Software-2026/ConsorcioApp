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
  #reclamosService = inject(ReclamoService);
  #fb = inject(FormBuilder);

  reclamos = this.#reclamosService.reclamos; // Nos suscribimos a los reclamos del servicio
  textoBusqueda = signal<string>('');
  ocultarResueltos = signal<boolean>(false); 
  
  mostrarModal: boolean = false;
  reclamoSeleccionado!: IReclamos;

  ngOnInit(): void {
    this.#reclamosService.cargarReclamos(); // Carga los reclamos al iniciar el componente
  }

  reclamosAMostrar = computed(() => {
    let lista = this.reclamos();
    const texto = this.textoBusqueda().toLowerCase().trim();

    if (texto !== '') {
      lista = lista.filter(r =>
        (r.descripcion || '').toLowerCase().includes(texto) ||
        (r.titulo || '').toLowerCase().includes(texto) ||
        (r.estado || '').toLowerCase().includes(texto)
      );
    }

    if (this.ocultarResueltos() === true) {
      lista = lista.filter(r => r.estado !== 'resuelto');
    }

    // Finalmente, devolvemos lo que haya quedado.
    return lista;
  });
  

  estadoForm: FormGroup = this.#fb.group({
    // Estructura: [ 'Valor por defecto', [Validadores] ]
    nuevoEstado: ['pendiente', Validators.required],
  });

  // --- ACCIÓN MASIVA: LIMPIAR RESUELTOS ---
  limpiarResueltos(): void {
    this.ocultarResueltos.update(valor => !valor);
  }

  // --- MODAL PARA CAMBIAR ESTADOS ---
  abrirGestion(reclamo: IReclamos): void {
    this.reclamoSeleccionado = reclamo;
    this.estadoForm.patchValue({ nuevoEstado: reclamo.estado }); // Pre-carga el estado actual en el select
    this.mostrarModal = true;
  }

  actualizarEstadoLocal(): void {
    if (this.estadoForm.valid) {
      // Buscamos el reclamo en nuestra lista y mutamos su estado directamente
      const index = this.reclamos().findIndex(r => r.id === this.reclamoSeleccionado.id);
      if (index !== -1) {
        this.reclamos()[index].estado = this.estadoForm.value.nuevoEstado;
      }
      this.#reclamosService.actualizarEstadoReclamo( this.reclamoSeleccionado.id, this.estadoForm.value.nuevoEstado );
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