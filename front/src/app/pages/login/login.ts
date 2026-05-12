import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  mensaje = '';
  error = '';
  // estas dos variables son para mostrar feedback en pantalla
  // mensaje = cuando todo sale bien
  // error = cuando algo esta mal

  constructor(private fb: FormBuilder, private router: Router) {
    // formbuilder es como el constructor del formulario, te evita armar todo a mano
    // router lo uso para poder mover al usuario entre pantallas (navigation)

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      // username es el email, es obligatorio y tiene que tener formato email valido

      password: ['', [Validators.required, Validators.minLength(6)]]
      // password es obligatorio y tiene que tener minimo 6 caracteres
    });
  }

  submit(tipoAcceso: 'usuario' | 'admin') {
    // esta funcion se ejecuta cuando apretas cualquiera de los botones de login

    this.mensaje = '';
    this.error = '';
    // limpio mensajes para no mezclar estados entre intentos

    if (this.loginForm.invalid) {
      // reviso si el formulario esta mal cargado o no cumple validaciones

      this.loginForm.markAllAsTouched();
      // marco todos los campos como tocados para que aparezcan los errores en pantalla

      this.error = 'Completá correctamente los campos';
      // muestro mensaje de error general

      return;
      // corto ejecucion si el form no es valido
    }

    // si el formulario es valido, simulo login correcto
    this.mensaje = `Login correcto como ${tipoAcceso}`;





    
    // aca hago la navegacion segun el tipo de usuario (simulacion de roles por ahora)
    setTimeout(() => {

      if (tipoAcceso === 'admin') {
        // si es admin lo mando al dashboard principal de administracion
        this.router.navigate(['/dashboard']);
      }

      if (tipoAcceso === 'usuario') {
        // si es usuario propietario lo mando a su dashboard
        this.router.navigate(['/owner']);
      }

    }, 500);
    // el timeout es solo para que se vea el mensaje antes de cambiar de pantalla
  }
}