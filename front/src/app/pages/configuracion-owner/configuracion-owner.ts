import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../auth/services/aurh';
import { UsuarioService } from '../../shared/service/UsuarioService';
import { Usuario } from '../../interfaces/Usuario';

@Component({
  selector: 'app-configuracion-owner',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './configuracion-owner.html',
  styleUrl: './configuracion-owner.css'
})
export class ConfiguracionOwner implements OnInit {
authService = inject(AuthService);
usuarioService = inject(UsuarioService);
fb = inject(FormBuilder);

residente = signal<Usuario | null>(null);


  passwordForm = this.fb.group({
    contraseñaActual: ['', [Validators.required]],
    contraseñaNueva: ['', [Validators.required, Validators.minLength(6)]],
    confirmarContraseña: ['', [Validators.required]]
  }, {
    // Le enchufamos nuestro validador a todo el grupo
    validators: this.passwordsCoincidenValidator
  });

  // Validador personalizado: Revisa que la nueva y la confirmación sean idénticas
  passwordsCoincidenValidator(grupo: AbstractControl): ValidationErrors | null {
    const pass = grupo.get('contraseñaNueva')?.value;
    const confirm = grupo.get('confirmarContraseña')?.value;

    // Si ambas tienen texto pero son distintas, devolvemos un error
    if (pass && confirm && pass !== confirm) {
      return { noCoinciden: true };
    }
    return null; // Si está todo OK, devolvemos null
  }

  ngOnInit(): void {
    this.cargarPerfil();
    
    console.log(this.residente()); 
  }

  cargarPerfil() {
    this.usuarioService.obtenerMiPerfil().subscribe({
      next: (data) => {
        console.log('Perfil obtenido:', data);
        this.residente.set(data);
      },
      error: (err) => console.error('Error al obtener perfil:', err)
    });
  }

  usuario = {
    recibirAvisos: true,
    notifPagos: true,
    fotoUrl: 'https://ui-avatars.com/api/?name=Juan+Perez&size=200'
  };

  seguridad = {
    passActual: '',
    passNueva: ''
  };

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // this.residente().fotoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarPerfil() {
    // Si el formulario es inválido (ej: las contraseñas no son iguales), lo frenamos acá
    if (this.passwordForm.invalid) {
      alert('Por favor, revisá el formulario. Las contraseñas deben coincidir.');
      return;
    }

    const nuevaClave = this.passwordForm.value.contraseñaNueva;
    this.usuarioService.cambiarMiPassword(nuevaClave!).subscribe({
      next: () => {
        alert('Contraseña actualizada con éxito');
        this.passwordForm.reset();
      },
      error: (err) => {
        console.error('Error al actualizar contraseña:', err);
        alert('Hubo un error al guardar. Verificá tu contraseña actual.');
      }
      
    });
    
    alert('Cambios guardados con éxito');
  }
}