import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ==========================================
// 1. INTERFAZ (Mapeada para el Backend/Front)
// ==========================================
export interface Expensa {
  id?: number;
  unidad: string;
  propietario: string;
  monto: number | string;
  vencimiento: string;
  estado: string; // 'Pagada', 'Pendiente', 'Vencida'
  tipo: string;   // 'Común', 'Extraordinaria'
}

// ==========================================
// 2. SERVICIO DE CONEXIÓN API (DJANGO)
// ==========================================
@Injectable({
  providedIn: 'root'
})
export class ExpensasService {
  private apiUrl = 'http://localhost:8000/api/expensas/';

  constructor(private http: HttpClient) {}

  getExpensas(): Observable<Expensa[]> {
    return this.http.get<Expensa[]>(this.apiUrl);
  }

  crearExpensa(expensa: Expensa): Observable<Expensa> {
    return this.http.post<Expensa>(this.apiUrl, expensa);
  }

  cambiarEstado(id: number, estado: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}${id}/`, { estado });
  }
}

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================
@Component({
  selector: 'app-expensas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './expensas.html',
  styleUrl: './expensas.css'
})
export class Expensas implements OnInit {

  // Listado inicial precargado con tus datos de prueba estructurados
  expensas: Expensa[] = [
    { unidad: 'A-203', propietario: 'Juan Pérez', monto: '42500', vencimiento: '2026-05-30', estado: 'Pagada', tipo: 'Común' },
    { unidad: 'B-101', propietario: 'Ana López', monto: '38900', vencimiento: '2026-05-30', estado: 'Pendiente', tipo: 'Común' },
    { unidad: 'C-304', propietario: 'Luis Gómez', monto: '45200', vencimiento: '2026-05-30', estado: 'Vencida', tipo: 'Extraordinaria' }
  ];

  textoBusqueda: string = '';
  mostrarModalAlta: boolean = false;
  mostrarModalGestion: boolean = false;
  
  expensaForm!: FormGroup;
  gestionForm!: FormGroup;
  expensaSeleccionada!: Expensa;

  constructor(private fb: FormBuilder, private expensasService: ExpensasService) {}

  ngOnInit(): void {
    this.cargarExpensasBackend();
    this.inicializarFormularios();
  }

  inicializarFormularios(): void {
    // Formulario Reactivo obligatorio para dar de alta una expensa (Común o Extraordinaria)
    this.expensaForm = this.fb.group({
      unidad: ['', Validators.required],
      propietario: ['', Validators.required],
      monto: ['', [Validators.required, Validators.min(1)]],
      vencimiento: ['2026-05-30', Validators.required],
      estado: ['Pendiente', Validators.required],
      tipo: ['Común', Validators.required]
    });

    // Formulario Reactivo para la edición rápida de estados por el administrador
    this.gestionForm = this.fb.group({
      nuevoEstado: ['Pendiente', Validators.required]
    });
  }

  cargarExpensasBackend(): void {
    this.expensasService.getExpensas().subscribe({
      next: (data: Expensa[]) => {
        this.expensas = data;
      },
      error: () => {
        console.log('Backend desconectado. Usando datos de simulación local.');
      }
    });
  }

  // --- ACCIÓN: CREAR NUEVA EXPENSA (LOCAL / BACK) ---
  guardarNuevaExpensa(): void {
    if (this.expensaForm.valid) {
      const nueva = this.expensaForm.value;
      this.expensasService.crearExpensa(nueva).subscribe({
        next: (res) => {
          this.cargarExpensasBackend();
          this.cerrarModales();
        },
        error: () => {
          // Respaldo local inmediato si se trabaja sin base de datos activa
          this.expensas.push(nueva);
          this.cerrarModales();
        }
      });
    } else {
      this.expensaForm.markAllAsTouched();
    }
  }

  // --- ACCIÓN: CAMBIAR ESTADO DESDE EL PANEL ---
  actualizarEstadoLocal(): void {
    if (this.gestionForm.valid) {
      const nuevoEst = this.gestionForm.value.nuevoEstado;
      const index = this.expensas.findIndex(e => e.unidad === this.expensaSeleccionada.unidad);
      if (index !== -1) {
        this.expensas[index].estado = nuevoEst;
      }
      this.cerrarModales();
    }
  }

  // --- ACCIÓN: ELIMINAR EXPENSA (POR EJEMPLO, LAS YA PAGADAS) ---
  eliminarExpensaVisual(unidad: string): void {
    this.expensas = this.expensas.filter(e => e.unidad !== unidad);
  }

  // --- FILTRO EN TIEMPO REAL ---
  get expensasFiltradas(): Expensa[] {
    if (!this.textoBusqueda.trim()) {
      return this.expensas;
    }
    return this.expensas.filter(e => 
      e.unidad.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      e.propietario.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      e.estado.toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );
  }

  // --- MANEJO DE MODALES ---
  abrirAlta(): void { this.mostrarModalAlta = true; }
  abrirGestion(expensa: Expensa): void {
    this.expensaSeleccionada = expensa;
    this.gestionForm.setValue({ nuevoEstado: expensa.estado });
    this.mostrarModalGestion = true;
  }
  cerrarModales(): void {
    this.mostrarModalAlta = false;
    this.mostrarModalGestion = false;
    this.expensaForm.reset({ vencimiento: '2026-05-30', estado: 'Pendiente', tipo: 'Común' });
  }

  // --- GETTERS AUTO-CALCULADOS PARA LAS CARDS ---
  get totalExpensas(): number { return this.expensas.length; }
  get pagadas(): number { return this.expensas.filter(e => e.estado === 'Pagada').length; }
  get pendientes(): number { return this.expensas.filter(e => e.estado === 'Pendiente').length; }
  get vencidas(): number { return this.expensas.filter(e => e.estado === 'Vencida').length; }
}