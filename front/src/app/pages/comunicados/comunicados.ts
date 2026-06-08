import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { ComunicadoService } from '../../shared/service/comunicadoservice'; 
import { Comunicado } from '../../interfaces/comunicado-interface'; 
import { AuthService } from '../../auth/services/aurh';

@Component({
  selector: 'app-comunicados',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './comunicados.html',
  styleUrl: './comunicados.css',
})
export class ComunicadosComponent implements OnInit {
  listaComunicados: Comunicado[] = [];
  comunicadoForm!: FormGroup; 
  isAdmin: boolean = false;

 
  constructor(
    private comunicadoService: ComunicadoService,
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    const user = this.authService.currentUser();
    // Verifica si el usuario logueado tiene rol de administrador.
    this.isAdmin = user?.rol === 'admin' || user?.rol === 'Administrador' || user?.rol === 'administrador';

    this.initForm();
    this.cargarComunicados();
  }

  initForm(): void {
    this.comunicadoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
      contenido: ['', [Validators.required]],
      es_urgente: [false]
    });
  }

  cargarComunicados(): void {
    this.comunicadoService.getComunicados().subscribe(
      (data) => {
        this.listaComunicados = data;
        console.log('Comunicados cargados:', this.listaComunicados);
        
        this.cdr.detectChanges();
      },
      (err) => {
        console.error('Error al traer los comunicados', err);
      }
    );
  }

  guardarComunicado(): void {
    if (this.comunicadoForm.invalid) {
      this.comunicadoForm.markAllAsTouched();
      return;
    }
    
    const comunicado: Comunicado = this.comunicadoForm.value;


  this.comunicadoService.createComunicado(comunicado).subscribe({
  next: (comunicadoCreado) => {
    console.log('¡Comunicado creado en Django!', comunicadoCreado);
    this.listaComunicados.unshift(comunicadoCreado); 
    this.comunicadoForm.reset({ titulo: '', contenido: '', es_urgente: false });
  },
  error: (err) => {
    console.error('Error al guardar en el backend', err);
  }
  });
  }

  eliminarComunicado(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('¿Está seguro de que desea eliminar este comunicado?')) {
      this.comunicadoService.deleteComunicado(id).subscribe({
        next: () => {
          this.listaComunicados = this.listaComunicados.filter(c => c.id !== id);
          console.log('Comunicado eliminado con éxito');
        },
        error: (err) => {
          console.error('Error al eliminar el comunicado', err);
        }
      });
    }
  }
}