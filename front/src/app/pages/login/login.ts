import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/service/aurh';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  loginForm: FormGroup;
  // aca guardo todo el formulario reactivo, osea username y password juntos en un solo objeto

  mensaje = signal<string>('');
  error = signal<string>('');
  // estas dos variables son para mostrar feedback en pantalla
  // mensaje = cuando todo sale bien
  // error = cuando algo esta mal

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    // formbuilder es como el constructor del formulario, te evita armar todo a mano
    // router lo uso para poder mover al usuario entre pantallas (navigation)
    // Inyectamos el AuthService para poder usarlo en el proceso de login

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      

      password: ['', [Validators.required, Validators.minLength(6)]]
      // password es obligatorio y tiene que tener minimo 6 caracteres
    });
  }

  submit(event: Event) {
    event.preventDefault();
    // esta funcion se ejecuta cuando apretas cualquiera de los botones de login

    this.mensaje.set('');
    this.error.set('');
    // limpio mensajes para no mezclar estados entre intentos

    if (this.loginForm.invalid) {
      // reviso si el formulario esta mal cargado o no cumple validaciones

      this.loginForm.markAllAsTouched();
      // marco todos los campos como tocados para que aparezcan los errores en pantalla

      this.error.set('Completá correctamente los campos');
      // muestro mensaje de error general

      return;
      // corto ejecucion si el form no es valido
    }

   // Extraemos los datos del formulario reactivo
    const { username, password } = this.loginForm.value;
    // Llamada real a nuestro backend en Django
    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log('Respuesta del backend exitosa:', response);
        this.mensaje.set('¡Bienvenido al sistema!');
        // 1. Leemos los datos que el servicio YA desarmó y guardó en la Signal
        const usuarioLogueado = this.authService.currentUser();
        console.log('Usuario logueado:', usuarioLogueado);
       if (usuarioLogueado && usuarioLogueado.rol === 'administrador') {
          this.router.navigate(['/dashboard']); // Panel de Admin
        } else {
          this.router.navigate(['/owner']); // Panel de Propietarios/Vecinos
        }
      },
      error: (err) => {
        // Si Django la rebota (401), avisamos en pantalla
        if (err.status === 401) {
          this.error.set('Usuario o contraseña incorrectos');
        } else {
          this.error.set('Error al conectar con el servidor');
        }
      }
    });




    
  }
}