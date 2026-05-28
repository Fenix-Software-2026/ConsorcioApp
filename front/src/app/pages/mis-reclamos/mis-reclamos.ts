import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ==========================================
// 1. INTERFAZ (Molde de datos)
// ==========================================
export interface Reclamo {
  id?: number;
  titulo: string;
  descripcion: string;
  estado: string;
}

// ==========================================
// 2. SERVICIO (Conexión directa a Django)
// ==========================================
@Injectable({
  providedIn: 'root'
})
export class ReclamoService {
  private apiUrl = 'http://localhost:8000/api/reclamos/';
  constructor(private http: HttpClient) { }

  getReclamos(): Observable<Reclamo[]> {
    return this.http.get<Reclamo[]>(this.apiUrl);
  }

  crearReclamo(reclamo: Reclamo): Observable<Reclamo> {
    return this.http.post<Reclamo>(this.apiUrl, reclamo);
  }
}

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================
@Component({
  selector: 'app-mis-reclamos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './mis-reclamos.html',
  styleUrl: './mis-reclamos.css'
})
export class MisReclamos implements OnInit {
  
  reclamos: Reclamo[] = [];
  reclamoForm!: FormGroup;
  mostrarModal: boolean = false;

  constructor(
    private reclamoService: ReclamoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.obtenerReclamosRealtime();
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.reclamoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      estado: ['Pendiente']
    });
  }

  obtenerReclamosRealtime(): void {
    this.reclamoService.getReclamos().subscribe({
      // Agregamos ': any' para que el compilador estricto de TS no tire error
      next: (data: any) => {
        this.reclamos = data;
      },
      error: (err: any) => {
        console.error('Error al conectar con Django:', err);
      }
    });
  }

  guardarNuevoReclamo(): void {
    if (this.reclamoForm.valid) {
      const nuevo: Reclamo = this.reclamoForm.value;
      
      this.reclamoService.crearReclamo(nuevo).subscribe({
        // Agregamos ': any' aquí también para evitar el error TS7006
        next: (reclamoCreado: any) => {
          this.obtenerReclamosRealtime();
          this.cerrarModal();
        },
        error: (err: any) => {
          alert('No se pudo conectar con el servidor backend de Django.');
        }
      });
    } else {
      this.reclamoForm.markAllAsTouched();
    }
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.reclamoForm.reset({ estado: 'Pendiente' });
  }

  get totalReclamos(): number { return this.reclamos.length; }
  get pendientes(): number { return this.reclamos.filter(r => r.estado === 'Pendiente').length; }
  get enProceso(): number { return this.reclamos.filter(r => r.estado === 'En proceso').length; }
  get resueltos(): number { return this.reclamos.filter(r => r.estado === 'Resuelto').length; }
}