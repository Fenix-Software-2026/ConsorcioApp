import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // <-- Cambiamos FormsModule por ReactiveFormsModule
import { CartService } from '../../shared/service/cartService';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // <-- Asegurate de incluir ReactiveFormsModule
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  carrito: any[] = [];
  total = 0;
  loading = false;
  toast = '';
  compraFinalizada = false;
  
  // Declaramos el grupo del formulario reactivo
  pagoForm!: FormGroup;

  constructor(
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder // <-- Inyectamos FormBuilder para armar las reglas
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.cartService.carrito$.subscribe((data: any[]) => {
      this.carrito = data || [];
      this.total = this.cartService.getTotal();
    });
  }

  // Definimos las reglas y validaciones para cada campo
  private initForm(): void {
    this.pagoForm = this.fb.group({
      // Requerido, solo letras y espacios (mínimo 3 caracteres)
      tarjetaNombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$')]],
      
      // Requerido, solo números, mínimo 16 dígitos y máximo 19 por los espacios simulados
      tarjetaNumero: ['', [Validators.required, Validators.pattern('^[0-9 ]*$'), Validators.minLength(16), Validators.maxLength(19)]],
      
      // Requerido, formato MM/AA estricto
      tarjetaVence: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/[0-9]{2}$')]],
      
      // Requerido, solo números, de 3 a 4 dígitos
      tarjetaCvv: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(3), Validators.maxLength(4)]]
    });
  }

  tieneCarrito(): boolean {
    return this.carrito.length > 0;
  }

  // Getters rápidos para usar en el HTML y saber si un campo está mal cargado
  get f() { return this.pagoForm.controls; }

  pagar(): void {
    // Si intentan hackear el botón sacando el 'disabled' del HTML, la lógica los frena acá
    if (this.pagoForm.invalid || !this.tieneCarrito()) {
      this.toast = 'Por favor, revisá los campos en rojo antes de continuar.';
      setTimeout(() => this.toast = '', 3000);
      return;
    }

    this.loading = true;
    this.toast = 'Procesando pago...';
    this.cdr.detectChanges(); 

    setTimeout(() => {
      this.loading = false;
      this.toast = '';
      this.compraFinalizada = true;
      this.cdr.detectChanges();

      // Dejamos los 8 segundos que configuramos antes
      setTimeout(() => {
        this.cartService.clear(); 
        this.router.navigate(['/owner']);
        this.cdr.detectChanges(); 
      }, 8000);

    }, 2000);
  }
}