import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-servicios-residente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './servicios-residente.html',
  styleUrl: './servicios-residente.css'
})
export class ServiciosResidente implements OnInit {

  servicios = [
    { nombre: 'Plomero', descripcion: 'Reparación de pérdidas, destapes y mantenimiento.', icono: 'bi bi-droplet-fill', precio: 4500 },
    { nombre: 'Electricista', descripcion: 'Instalaciones y reparaciones eléctricas.', icono: 'bi bi-lightning-fill', precio: 3500 },
    { nombre: 'Gasista', descripcion: 'Instalaciones y mantenimiento matriculado.', icono: 'bi bi-fire', precio: 5500 },
    { nombre: 'Cerrajero 24hs', descripcion: 'Apertura y cambio de cerraduras.', icono: 'bi bi-key-fill', precio: 6000 },
    { nombre: 'Limpieza', descripcion: 'Servicio de limpieza para el hogar.', icono: 'bi bi-stars', precio: 3000 },
    { nombre: 'Aire acondicionado', descripcion: 'Instalación y mantenimiento.', icono: 'bi bi-fan', precio: 7000 }
  ];

  carritoAbierto = false;
  carrito: any[] = [];

  constructor(
    public cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.carrito$.subscribe(data => {
      this.carrito = data;
    });
  }

  toggleCarrito(): void {
    this.carritoAbierto = !this.carritoAbierto;
  }

  agregarAlCarrito(servicio: any): void {
    this.cartService.add(servicio);
  }

  eliminarDelCarrito(index: number): void {
    this.cartService.remove(index);
  }

  get totalCarrito(): number {
    return this.cartService.getTotal();
  }

  get cantidadCarrito(): number {
    return this.carrito.length;
  }

  irCheckout(): void {
    const carritoActual = this.cartService.getCart();

    console.log("CHECKOUT SNAPSHOT:", carritoActual);

    if (!carritoActual || carritoActual.length === 0) {
      alert("Carrito vacío");
      return;
    }

    this.router.navigate(['/owner/checkout']);
  }
}