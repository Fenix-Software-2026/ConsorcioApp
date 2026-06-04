import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // 👈 Los imports de arriba quedan igual

import { ComunicadoService } from '../../shared/service/comunicadoservice'; 
import { Comunicado } from '../../interfaces/comunicado-interface'; 

@Component({
  selector: 'app-comunicados',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './comunicados.html',
  styleUrl: './comunicados.css',
})
export class ComunicadosComponent implements OnInit {
  listaComunicados: Comunicado[] = [];
  comunicadoForm!: FormGroup; 

 
  constructor(
    private comunicadoService: ComunicadoService,
    private fb: FormBuilder 
  ) {}
  
  ngOnInit(): void {
    this.initForm();
    this.cargarComunicados();
  }

  initForm(): void {
    this.comunicadoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
      contenido: ['', [Validators.required]],
      es_urgente: [false]
    });
  }

  cargarComunicados(): void {
    this.comunicadoService.getComunicados().subscribe(
      (data) => {
        this.listaComunicados = data;
        console.log('Comunicados cargados:', this.listaComunicados);
      },
      (err) => {
        console.error('Error al traer los comunicados', err);
      }
    );
  }

  guardarComunicado(): void {
    if (this.comunicadoForm.invalid) {
      this.comunicadoForm.markAllAsTouched();
      return;
    }
    
    const comunicado: Comunicado = this.comunicadoForm.value;


  this.comunicadoService.createComunicado(comunicado).subscribe({
  next: (comunicadoCreado) => {
    console.log('¡Comunicado creado en Django!', comunicadoCreado);
    this.listaComunicados.unshift(comunicadoCreado); 
    this.comunicadoForm.reset({ titulo: '', contenido: '', es_urgente: false });
  },
  error: (err) => {
    console.error('Error al guardar en el backend', err);
  }
  });
  }
}