import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../shared/service/UsuarioService';

@Component({
  selector: 'usuario-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './usuario-modal.html',
  styleUrl: './usuario-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioModal implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);

  listaUnidades = input<any[]>([]);
  alCerrar = output<void>();
  alGuardar = output<void>();

  usuarioForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }
  
  initForm(): void {
    this.usuarioForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      unidad_id: ['', Validators.required]
    });
  }
  
  cerrarModal(): void {
    this.alCerrar.emit(); // Le avisa al padre que toque el botón de cerrar o cancelar
  }
  

  

  guardarNuevoUsuario(): void {
    if(this.usuarioForm.valid) {
      const unidadEncontrada = this.listaUnidades().find(u => u.id === Number(this.usuarioForm.value.unidad_id));
      const data = {...this.usuarioForm.value,
        piso: unidadEncontrada?.piso,
        departamento: unidadEncontrada?.departamento

      }; // Aquí podés transformar los datos del formulario si tu backend espera algo distinto 
      console.log(data)
      this.usuarioService.crearResidente(data).subscribe({
        next: () => {
          this.alGuardar.emit(); // Le avisa al padre: "¡Che, ya guardé! Refrescá la tabla"
          this.cerrarModal();
        },
        error: (err) => {
          console.error(err);
          alert('Error al registrar el usuario en la base de datos de Django.');
          alert('Detalles del error: ' + (err.error?.detail || JSON.stringify(err.error) || err.message || 'Error desconocido'));
        }
      });
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }
 }
