import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../shared/service/cartService';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmacion.html',
  styleUrl: './confirmacion.css'
})
export class Confirmacion {

  // =========================
  // ESTADO DEL CARRITO
  // =========================
  carrito: any[] = [];
  total: number = 0;

  // =========================
  // ESTADOS UX
  // =========================
  loading: boolean = false; // muestra "procesando solicitud"
  toast: string = '';       // mensaje tipo app (en vez de alert)

  constructor(
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // cargamos los datos al entrar a la pantalla
    this.cargarCarrito();
  }

  // =========================
  // OBTENER DATOS DEL CARRITO
  // =========================
  private cargarCarrito(): void {

    // traemos el carrito desde el service (fuente única de verdad)
    this.carrito = this.cartService.getCart();

    // calculamos total centralizado
    this.total = this.cartService.getTotal();
  }

  // =========================
  // CONFIRMAR SOLICITUD (FLUJO UX REAL)
  // =========================
  confirmar(): void {

    // 1. activamos loading (bloquea UI + feedback visual)
    this.loading = true;

    // 2. mostramos toast inmediato
    this.toast = 'Procesando solicitud...';

    // 3. simulamos request (backend futuro)
    setTimeout(() => {

      // 4. limpiamos carrito global
      this.cartService.clear();

      // 5. limpiamos estado local
      this.carrito = [];
      this.total = 0;

      // 6. cambiamos mensaje de éxito
      this.toast = 'Solicitud enviada con éxito';

      // 7. apagamos loading
      this.loading = false;

      // 8. redirección suave
      setTimeout(() => {
        this.toast = '';
        this.router.navigate(['/owner']);
      }, 800);

    }, 1200);
  }

  // =========================
  // UTIL PARA TEMPLATE
  // =========================
  hayCarrito(): boolean {
    return this.carrito.length > 0;
  }
}