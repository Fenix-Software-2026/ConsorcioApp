import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'carrito';
  private carritoSubject: BehaviorSubject<any[]>;
  carrito$;

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    const parsed = saved ? JSON.parse(saved) : [];
    this.carritoSubject = new BehaviorSubject<any[]>(parsed);
    this.carrito$ = this.carritoSubject.asObservable();
  }

  private getValue(): any[] {
    return this.carritoSubject.getValue();
  }

  private save(data: any[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    this.carritoSubject.next([...data]);
  }

  add(servicio: any): void {
    this.save([...this.getValue(), servicio]);
  }

  remove(index: number): void {
    const copy = [...this.getValue()];
    copy.splice(index, 1);
    this.save(copy);
  }

  clear(): void {
    this.save([]);
  }

  getCart(): any[] {
    return this.getValue();
  }

  getTotal(): number {
    return this.getValue().reduce((acc, item) => acc + item.precio, 0);
  }
}