import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

// ==========================================
// INTERFAZ DEL MODELO DE TRANSACCIONES/PAGOS
// ==========================================
export interface MovimientoCaja {
  concepto: string;      // Ej: 'Expensas Unidad A-203', 'Abono Ascensores', 'Sueldo Limpieza'
  referencia: string;    // Propietario, Proveedor o Empleado
  monto: number;         // Valor numérico directo para operaciones matemáticas
  tipo: 'Ingreso' | 'Egreso';
  fecha: string;
  metodo: string;        // 'Transferencia', 'Efectivo', 'Cheque'
  estado: 'Pagado' | 'Pendiente' | 'Vencido';
}

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './pagos.html',
  styleUrl: './pagos.css'
})
export class Pagos implements OnInit {

  // Listado base transformado en un flujo de caja real
  pagos: MovimientoCaja[] = [
    { concepto: 'Expensas Unidad A-203', referencia: 'Juan Pérez', monto: 42500, tipo: 'Ingreso', fecha: '2026-05-20', metodo: 'Transferencia', estado: 'Pagado' },
    { concepto: 'Abono Mensual Ascensores', referencia: 'Ascensores Córdoba', monto: 38900, tipo: 'Egreso', fecha: '2026-05-22', metodo: 'Transferencia', estado: 'Pendiente' },
    { concepto: 'Liquidación de Sueldo', referencia: 'Carlos Gómez (Personal)', monto: 45200, tipo: 'Egreso', fecha: '2026-05-18', metodo: 'Cheque', estado: 'Vencido' }
  ];

  textoBusqueda: string = '';
  mostrarModalAlta: boolean = false;
  mostrarModalGestion: boolean = false;

  pagoForm!: FormGroup;
  gestionForm!: FormGroup;
  pagoSeleccionado!: MovimientoCaja;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inicializarFormularios();
  }

  inicializarFormularios(): void {
    this.pagoForm = this.fb.group({
      concepto: ['', Validators.required],
      referencia: ['', Validators.required],
      monto: [null, [Validators.required, Validators.min(1)]],
      tipo: ['Ingreso', Validators.required],
      fecha: ['2026-05-27', Validators.required],
      metodo: ['Transferencia', Validators.required],
      estado: ['Pagado', Validators.required]
    });

    this.gestionForm = this.fb.group({
      nuevoEstado: ['Pagado', Validators.required]
    });
  }

  // --- FILTRADO EN TIEMPO REAL ---
  get pagosFiltrados(): MovimientoCaja[] {
    if (!this.textoBusqueda.trim()) {
      return this.pagos;
    }
    return this.pagos.filter(p => 
      p.concepto.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      p.referencia.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      p.estado.toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );
  }

  // --- ACCIONES EN MEMORIA LOCAL ---
  guardarNuevoPago(): void {
    if (this.pagoForm.valid) {
      this.pagos.push(this.pagoForm.value);
      this.cerrarModales();
    } else {
      this.pagoForm.markAllAsTouched();
    }
  }

  actualizarEstadoLocal(): void {
    if (this.gestionForm.valid) {
      const index = this.pagos.findIndex(p => p.concepto === this.pagoSeleccionado.concepto && p.referencia === this.pagoSeleccionado.referencia);
      if (index !== -1) {
        this.pagos[index].estado = this.gestionForm.value.nuevoEstado;
      }
      this.cerrarModales();
    }
  }

  eliminarPagoVisual(concepto: string, referencia: string): void {
    this.pagos = this.pagos.filter(p => !(p.concepto === concepto && p.referencia === referencia));
  }

  // --- CONTROL DE MODALES ---
  abrirAlta(): void {
    this.mostrarModalAlta = true;
  }

  abrirGestion(pago: MovimientoCaja): void {
    this.pagoSeleccionado = pago;
    this.gestionForm.setValue({ nuevoEstado: pago.estado });
    this.mostrarModalGestion = true;
  }

  cerrarModales(): void {
    this.mostrarModalAlta = false;
    this.mostrarModalGestion = false;
    this.pagoForm.reset({ tipo: 'Ingreso', fecha: '2026-05-27', metodo: 'Transferencia', estado: 'Pagado' });
  }

  // --- CALCULADORES FINANCIEROS EN TIEMPO REAL ---
  get balanceCaja(): number {
    return this.totalIngresos - this.totalEgresos;
  }

  get totalIngresos(): number {
    return this.pagos
      .filter(p => p.tipo === 'Ingreso' && p.estado === 'Pagado')
      .reduce((sum, p) => sum + p.monto, 0);
  }

  get totalEgresos(): number {
    return this.pagos
      .filter(p => p.tipo === 'Egreso' && p.estado === 'Pagado')
      .reduce((sum, p) => sum + p.monto, 0);
  }

  get totalPendienteCobro(): number {
    return this.pagos
      .filter(p => p.estado !== 'Pagado')
      .reduce((sum, p) => sum + p.monto, 0);
  }
}