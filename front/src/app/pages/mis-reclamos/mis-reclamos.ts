import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IReclamos } from '../../interfaces/Reclamos';
import { ReclamoService } from '../../shared/service/ReclamoService';


@Component({
  selector: 'app-mis-reclamos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './mis-reclamos.html',
  styleUrl: './mis-reclamos.css'
})
export class MisReclamos implements OnInit {
  #reclamoService = inject(ReclamoService);
  #fb = inject(FormBuilder);

  reclamos = this.#reclamoService.reclamos;
  mostrarModal: boolean = false;
  mostrarModalEditar: boolean = false;
  reclamoForm!: FormGroup;


  ngOnInit(): void {
    this.#reclamoService.cargarReclamos();
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.reclamoForm = this.#fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      categoria: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      estado: ['pendiente']
    });
  }

  guardarNuevoReclamo(): void {
    if (this.reclamoForm.valid) {
      console.log('Formulario válido:', this.reclamoForm.valid);
      const nuevo: IReclamos = this.reclamoForm.value;      
      this.#reclamoService.crearReclamo(nuevo);
      this.cerrarModal();
    }
  }
  abrirModalEditar(reclamo: IReclamos): void {
    this.mostrarModalEditar = true;
    
    console.log(reclamo)
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.mostrarModalEditar = false;
  }

  totalReclamos = computed(() => this.reclamos().length);
  pendientes = computed(() => this.reclamos().filter(r => r.estado === 'pendiente').length);
  enProceso = computed(() => this.reclamos().filter(r => r.estado === 'en_proceso').length);
  resueltos = computed(() => this.reclamos().filter(r => r.estado === 'resuelto').length);
}
