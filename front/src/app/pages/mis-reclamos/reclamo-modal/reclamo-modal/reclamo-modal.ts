import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IReclamos } from '../../../../interfaces/Reclamos';

@Component({
  selector: 'app-reclamo-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './reclamo-modal.html',
  styleUrl: './reclamo-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReclamoModal implements OnInit {
    #fb = inject(FormBuilder);

    reclamoSelected = input<IReclamos>();

    reclamoForm = this.#fb.group({
        titulo: [''],
        categoria: [''],
        descripcion: [''],
        estado: ['pendiente']
    });
    
    
    ngOnInit(): void {
        if (this.reclamoSelected) {
            this.reclamoForm.patchValue({
                titulo: this.reclamoSelected()?.titulo,
                categoria: this.reclamoSelected()?.categoria,
                descripcion: this.reclamoSelected()?.descripcion,
                estado: this.reclamoSelected()?.estado
            });
        }
      }
    
    
    onActualizar = output<IReclamos>();
    actualizarReclamo() {
        this.onActualizar.emit(this.reclamoForm.value as IReclamos);
    }
    
    onGuardar = output<void>();
    guardarNuevoReclamo() {
        this.onGuardar.emit();
    }
    
    onCerrar = output<void>();
    cerrarModal() {
        this.onCerrar.emit();
    }


}
