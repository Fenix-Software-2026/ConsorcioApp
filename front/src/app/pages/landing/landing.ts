import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import * as AOS from 'aos';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ReactiveFormsModule], 
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit {
  contactForm!: FormGroup;
  showForm = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    AOS.init({ duration: 1000, once: true });
  }

  
  toggleContactForm() {
    this.showForm = !this.showForm;
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Datos del formulario:', this.contactForm.value);
      alert('¡Gracias por contactarte! Nos comunicaremos pronto.');
      this.contactForm.reset();
      this.showForm = false;
    }
  }
}
