import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-expensas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-expensas.html',
  styleUrl: './mis-expensas.css'
})

export class MisExpensas {

expensas=[

{
periodo:'Mayo 2026',
monto:'$95.500',
vencimiento:'15/05/2026',
estado:'Pagada'
},

{
periodo:'Junio 2026',
monto:'$98.000',
vencimiento:'15/06/2026',
estado:'Pendiente'
},

{
periodo:'Abril 2026',
monto:'$91.000',
vencimiento:'15/04/2026',
estado:'Pagada'
}

];

}